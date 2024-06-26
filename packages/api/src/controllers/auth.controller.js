const {
    sendResponse,
    badResponse,
    successResponse,
    errorResponse,
} = require("../helpers/response");
const { genHash, compareHash, genAccessToken } = require("../helpers");
const User = require("../models/users.model");

class AuthController {
    async checkEmail(req, res) {
        try {
            const email = req.body.email;
            const user = await User.findOne(
                { email },
                {
                    picture: 1,
                }
            );

            if (user === null) {
                return badResponse(res, "User not found!");
            }

            successResponse(res, "Found user!", { picture: user.picture });
        } catch (error) {
            console.log(error);
            errorResponse(res, "Internal server error!");
        }
    }

    async signUp(req, res) {
        console.log(req.body);
        try {
            let { email, name, username, password, tiktok } = req.body;

            // Check if your with email already exists
            const userWithEmail = await User.findOne({
                email,
            });

            if (userWithEmail) {
                return errorResponse(
                    res,
                    "A user with this email already exists!"
                );
            }

            password = await genHash(password);

            let picture = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

            const user = await User.create({
                name,
                email,
                password,
                tiktok,
                picture,
            });

            const token = genAccessToken({
                _id: user._id.toString(),
                email,
                name,
                tiktok,
                type: "user",
            });

            successResponse(res, "Account Created Successfully!", {
                token,
                user: {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                },
            });
        } catch (error) {
            console.log(error);
            errorResponse(res);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                email,
            });

            if (!user) {
                return errorResponse(res, "User not found!");
            }

            if (compareHash(password, user.password)) {
                const token = genAccessToken({
                    _id: user._id.toString(),
                    name: user.name,
                    tiktok: user.tiktok,
                    email: user.email,
                    type: "user",
                });

                return successResponse(res, "Login successful", {
                    token,
                    user: {
                        _id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        gender: user.gender,
                        picture: user.picture,
                        tiktok: user.tiktok,
                    },
                });
            }

            return errorResponse(res, "Invalid Password!");
        } catch (error) {
            console.log(error);
            errorResponse(res);
        }
    }
}

module.exports = new AuthController();
