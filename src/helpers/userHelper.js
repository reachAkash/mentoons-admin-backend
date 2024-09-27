const { customError } = require("../middlewares/errorHandler");
const User = require("../models/user.models");

module.exports = {
  registerUser: async (data) => {
    const { name, email, password, role } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw customError(409, "Email is already taken");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (!user) {
      throw customError(
        500,
        "Something went wrong while registering the user."
      );
    }

    console.log(user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return createdUser;
  },
  loginUser: async (data) => {
    const { email, password } = data;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw customError(404, "User does not exist");
    }
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    const user = await User.findById(existingUser._id).select(
      "-password -refreshToken"
    );
    return user;
  },
};
