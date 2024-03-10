import express from "express";
import { googleAuth, signIn, signUp } from "../Controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google-auth").post(googleAuth);

export default router;
