import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import User from "../Schema/User.js";

export const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.Secret_Access_Key
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

export const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 3)) : "";

  return username;
};
