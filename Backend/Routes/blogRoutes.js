import express from "express";
import {
  createBlog,
  latestBlogs,
  searchBlogs,
  trendingBlogs,
  verifyJWT,
} from "../Controllers/blogController.js";

const router = express.Router();

router.route("/latest-blogs").get(latestBlogs);
router.route("/trending-blogs").get(trendingBlogs);
router.route("/search-blogs").post(searchBlogs);
router.route("/create-blog").post(verifyJWT, createBlog);

export default router;
