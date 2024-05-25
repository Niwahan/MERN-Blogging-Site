import express from "express";
import {
  createBlog,
  latestBlogs,
  verifyJWT,
} from "../Controllers/blogController.js";

const router = express.Router();

router.route("/latest-blogs").get(latestBlogs);
router.route("/create-blog").post(verifyJWT, createBlog);

export default router;
