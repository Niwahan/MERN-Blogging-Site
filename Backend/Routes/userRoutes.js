import express from "express";
import {
  changePassword,
  googleAuth,
  signIn,
  signUp,
} from "../Controllers/userController.js";
import { verifyJWT } from "../Services/userServices.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google-auth").post(googleAuth);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
