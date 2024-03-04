import express from "express";
import { signIn, signUp } from "../Controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

export default router;
