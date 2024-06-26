/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Query from "../../api/query";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
import { AntDUpload } from "../../components/antd-upload";

const EditProduct = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    quantity: "",
    info: "",
    images: [],
  });

  const queryParamsArray = [
    {
      id: `item-${id}`,
      url: `product/${id}`,
    },
  ];
  const { queries, handleDataUpdate } = Query(queryParamsArray);
  const { mutation } = Mutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleUpdateImages = (img: any) => {
    setFormData((prev: any) => ({
      ...prev,
      images: img,
    }));
  };

  const handleFormSubmit = () => {
    const data = { method: "post", url: `product/${id}`, content: formData };
    mutation.mutate(data);
    handleDataUpdate();
    if (mutation.isSuccess) {
      toast({
        title: "Success! All done.",
        description: "Item updated successfully",
        action: <ToastAction altText='done'>done</ToastAction>,
      });
    }
  };

  useEffect(() => {
    if (queries[0].isSuccess) {
      setFormData((prev: any) => ({
        ...prev,
        name: queries[0].data.data.name,
        price: queries[0].data.data.price,
        quantity: queries[0].data.data.quantity,
        info: queries[0].data.data.info,
        images: queries[0].data.data.images,
      }));
    }
  }, [queries[0].isSuccess]);

  return (
    <>
      {queries[0].isLoading ? (
        <EditSkeleton />
      ) : (
        <div className='flex md:flex-row flex-col md:gap-20 md:pb-0 pb-24 p-5 bg-white rounded-xl'>
          <AntDUpload
            images={formData.images}
            selectImageFn={handleUpdateImages}
          />
          <div className='w-full'>
            <div className='grid grid-cols-2 gap-4 p-4 bg-white rounded-lg'>
              <div className='col-span-2'>
                <Label htmlFor='name' className='text-right'>
                  Product Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  placeholder='Apple Iphone 12'
                  className='mt-2'
                  value={formData.name}
                  required
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div>
                <Label htmlFor='name' className='text-right'>
                  Price
                </Label>
                <Input
                  id='price'
                  name='price'
                  type='text'
                  placeholder='1000'
                  className='mt-2'
                  value={formData.price}
                  required
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div>
                <Label htmlFor='name' className='text-right'>
                  Quantity
                </Label>
                <Input
                  id='quantity'
                  name='quantity'
                  type='number'
                  placeholder='10'
                  className='mt-2'
                  value={formData.quantity}
                  required
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div className='col-span-2'>
                <Label htmlFor='message-2'>Product Info</Label>
                <Textarea
                  placeholder='Type the product info here...'
                  id='message-2'
                  name='info'
                  className='mt-2'
                  value={formData.info}
                  required
                  onChange={(e) => handleTextAreaChange(e)}
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

export default EditProduct;
