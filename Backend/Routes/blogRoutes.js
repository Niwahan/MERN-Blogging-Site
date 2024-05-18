import express from "express";
import { createBlog, verifyJWT } from "../Controllers/blogController.js";

const router = express.Router();

router.route("/create-blog").post(verifyJWT,createBlog);


export default router;