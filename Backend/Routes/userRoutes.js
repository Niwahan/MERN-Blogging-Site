import express from "express";
import {
  allNotificationsCount,
  changePassword,
  googleAuth,
  newNotification,
  notifications,
  signIn,
  signUp,
  updateProfile,
  updateProfileImage,
} from "../Controllers/userController.js";
import { verifyJWT } from "../Services/userServices.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google-auth").post(googleAuth);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-profile-image").post(verifyJWT, updateProfileImage);
router.route("/update-profile").post(verifyJWT, updateProfile);
router.route("/new-notification").get(verifyJWT, newNotification);
router.route("/notifications").post(verifyJWT, notifications);
router.route("/all-notification-count").post(verifyJWT, allNotificationsCount);

export default router;
