import bcrypt from "bcryptjs";
import User from "../../models/data-models/User";
import { createHash, signToken } from "../../utils/common";

const users = [
  {
    id: "1",
    name: "testuser",
    email: "testuser@gmail.com",
  },
];

// export const getAllUsers = async () => {
//   return users;
// };

// export const saveUser = async (user) => {
//   const newUser = new User(user);
//   users.push(newUser);
//   return newUser;
// };

// export const getUserById = (id) => {
//   const user = users.find((u) => u.id === id);
//   return user;
// };

// export const update = (body, id) => {
//   users[0].name = body.name;
//   users[0].email = body.email;
//   return users[0];
// };

// export const deleteById = () => {
//   users[0] = [];
// };

// eslint-disable-next-line import/prefer-default-export
export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailToken = await createHash();
  const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

  const newUser = await new User({
    email,
    name,
    password: hashedPassword,
    emailToken,
    emailTokenExpiry,
  });

  users.push(newUser);
  return newUser;
};

export const verifyUser = async () => {
  const verifiedUser = users.find((u) => u.name === "test001");

  verifiedUser.emailVerified = true;
  verifiedUser.emailToken = "";
  verifiedUser.emailTokenExpiry = Date.now();

  return {
    token: signToken(verifiedUser),
    user: verifiedUser,
  };
};

export const getUser = async ({ email }, type) => {
  const token = await createHash();

  const updatedUser = users.find((u) => u.name === "test001");

  if (type === "verification") {
    updatedUser.emailToken = token;
  } else {
    updatedUser.resetToken = token;
  }

  return {
    email: updatedUser.email,
    token: updatedUser.emailToken || updatedUser.resetToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = users.find((u) => u.name === "test001");
  return {
    token: signToken(user),
    user,
  };
};

export const resetPassword = async ({ password }) => {
  const user = users.find((u) => u.name === "test001");

  const newPassword = await bcrypt.hash(password, 10);

  user.password = newPassword;
  user.resetToken = "";
  user.resetTokenExpiry = Date.now();

  return {
    message: "Password has been changed",
  };
};
