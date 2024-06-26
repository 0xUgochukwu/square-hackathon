/** @format */

import { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import Mutation from "../../api/mutation";
import { Button } from "../../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import EditSkeleton from "../../components/edit-skeleton";
import { ToastAction } from "../../components/ui/toast";
import { useToast } from "../../components/ui/use-toast";
import "../../components/embla-carousel/styles/base.css";
import "../../components/embla-carousel/styles/sandbox.css";
import "../../components/embla-carousel/styles/embla.css";
import { getCookieData, getLocalStorage, setCookie, setLocalStorage } from "../../services/storage";
import { AntDUploadSingle } from "../../components/antd-upload";

const Settings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({
    name: "",
    tiktok: "",
    picture: "",
  });

  const { mutation } = Mutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleUpdateImages = (img: any) => {
    console.log(img);
    setFormData((prev: {picture: string}) => ({
      ...prev,
      picture: img[0],
    }));
  };

  const handleFormSubmit = async () => {
    const data = { method: "post", url: `user/update`, content: formData };
    const update = await mutation.mutateAsync(data);
    if (update.success) {
      setFormData((prev: {[key: string]: any}) => ({
        ...prev,
        name: update.data.name,
        picture: update.data.picture,
        tiktok: update.data.tiktok,
      }));
       const {
         data: { picture, ...userDataWithoutPictureUrl },
       } = update;
      setCookie("@user", JSON.stringify(userDataWithoutPictureUrl), 1);
      setLocalStorage("@picture", JSON.stringify(picture));
      toast({
        title: "Success! All done.",
        description: "Item updated successfully",
        action: <ToastAction altText='done'>done</ToastAction>,
      });
    }
  };

  useEffect(() => {
    const userData = getCookieData("user");
    const profilePicture = getLocalStorage("@picture");

    if (userData) {
      setFormData((prev: { [key: string]: any }) => ({
        ...prev,
        name: userData.name,
        tiktok: userData.tiktok || "tiktok",
        picture: profilePicture ? JSON.parse(profilePicture) : "",
      }));
    }
  }, []);

  return (
    <>
      {!formData.name ? (
        <EditSkeleton />
      ) : (
        <div className='flex md:flex-row flex-col items-center md:gap-20 md:pb-5 pb-24 p-5 bg-white rounded-xl'>
          <div className='flex items-center justify-center flex-col md:w-1/2 w-full text-center'>
            <div className='text-gray-500'>
              <img
                className={`bg-center bg-cover bg-no-repeat rounded-full inline-block h-full w-full m-3`}
                src={encodeURI(formData?.picture) || ""}
                alt='avatar'
              />
            </div>
            <AntDUploadSingle selectImageFn={handleUpdateImages} />
          </div>
          <div className='w-full'>
            <div className='grid grid-cols-2 gap-4 p-4 bg-white rounded-lg'>
              <div className='col-span-2'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  placeholder='John Doe'
                  className='mt-2'
                  value={formData.name}
                  required
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div className='col-span-2'>
                <Label htmlFor='name' className='text-right'>
                  Social
                </Label>
                <Input
                  id='tiktok'
                  name='tiktok'
                  type='text'
                  placeholder='square_hack'
                  className='mt-2'
                  value={formData.tiktok}
                  required
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div>
                <Button onClick={handleFormSubmit}>
                  {mutation.isPending ? (
                    <>
                      <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                      Saving
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
