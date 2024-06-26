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

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Access Token is invalid" });
    }

    req.user = user.id;
    next();
  });
};