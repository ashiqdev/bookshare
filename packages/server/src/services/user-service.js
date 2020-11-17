import bcrypt from "bcryptjs";
import { BadRequest, NotFound } from "../utils/errors";
import User from "../models/User";
import { createHash, replaceLastNChars, signToken } from "../utils/common";
import cloudinary from "../utils/cloudinary";

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const getUserById = async (id) => {
  const user = await User.findOne({ _id: id });
  return user;
};

export const update = async (user, id) => {
  if (user.phone) {
    // eslint-disable-next-line no-param-reassign
    user.slicedPhone = replaceLastNChars(user.phone, "X", 5);
  }
  if (user.image) {
    const uploadedResponse = await cloudinary.uploader.upload(user.image, {
      upload_preset: "seplt5p0",
      eager: [
        {
          width: 400,
          height: 400,
          gravity: "face",
          crop: "crop",
          radius: "max",
        },
      ],
    });
    // eslint-disable-next-line no-param-reassign
    user.image = uploadedResponse.eager[0].url;
  }
  let updatedUser;

  if (user.address && user.gender && user.phone) {
    const body = { ...user, completed: true };
    updatedUser = await User.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();
  } else {
    updatedUser = await User.findOneAndUpdate({ _id: id }, user, {
      new: true,
    }).exec();
  }

  if (updatedUser) return updatedUser;

  throw new NotFound("User not found by given id");
};

export const deleteById = async (id) => {
  const user = await User.findOne({ _id: id });
  if (user) {
    await User.deleteOne({ _id: id });
    return;
  }

  throw new NotFound("User not found by given id");
};

export const registerUser = async ({ name, email, password }) => {
  const user = await User.findOne({ email });
  if (user) throw new BadRequest("Email is already taken", "email");

  const hashedPassword = await bcrypt.hash(password, 10);

  const emailToken = await createHash();
  const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

  const newUser = await new User({
    email,
    name,
    password: hashedPassword,
    emailToken,
    emailTokenExpiry,
  }).save();

  return newUser;
};

export const verifyUser = async ({ emailToken }) => {
  // find user
  const user = await User.findOne({
    emailToken,
    emailTokenExpiry: {
      $gte: Date.now() - 3600000,
    },
  });

  if (!user) throw new NotFound("This link is either invalid or exprired");

  const verifiedUser = await User.findOneAndUpdate(
    { _id: user.id },
    {
      $set: {
        emailVerified: true,
        email: user.email,
        emailToken: "",
        emailTokenExpiry: Date.now(),
      },
    },
    { new: true }
  );

  return {
    token: signToken(verifiedUser),
    user: verifiedUser,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw new NotFound("No user found with this email!", "email");

  if (!user.emailVerified)
    throw new BadRequest("you have to verify your email first", "email");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new BadRequest("Invalid Password", "password");

  return {
    token: signToken(user),
    user,
  };
};

export const getUser = async ({ email }, type) => {
  const token = await createHash();
  const tokenExpiry = Date.now() + 3600000; // 1 hour from now

  let updatedUser;

  if (type === "verification") {
    updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          emailToken: token,
          emailTokenExpiry: tokenExpiry,
        },
      },
      { new: true }
    );
  } else {
    updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: tokenExpiry,
        },
      },
      { new: true }
    );
  }

  if (!updatedUser)
    throw new NotFound("No user found with this email", "email");

  return {
    email: updatedUser.email,
    token: updatedUser.emailToken || updatedUser.resetToken,
  };
};

export const getCurrentUser = async (id) => {
  const user = await User.findOne({ _id: id });
  if (!user) throw new NotFound("user not found", "user");
  return user;
};

export const resetPassword = async ({
  resetToken,
  password,
  confirmPassword,
}) => {
  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: {
      $gte: Date.now() - 3600000, // make sure that the token is used within one hour
    },
  });

  if (!user) throw new BadRequest("This token is either invalid or expired");

  if (password !== confirmPassword)
    throw new BadRequest("password don't match", "password");

  const newPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { _id: user.id },
    {
      $set: {
        password: newPassword,
        resetToken: "",
        resetTokenExpiry: Date.now(),
      },
    },
    { new: true }
  );

  return {
    message: "Password has been changed",
  };
};

export const socialSignIn = async ({ email, name }) => {
  const user = await User.findOne({ email });
  if (user) {
    const token = signToken(user);
    return { token, user };
  }

  const password = email + process.env.APP_SECRET;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await new User({
    name,
    email,
    password: hashedPassword,
    emailVerified: true,
  }).save();

  const token = signToken(newUser);

  return {
    token,
    user: newUser,
  };
};
