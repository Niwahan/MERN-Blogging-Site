import express from "express";
import {
  allLatestBlogs,
  createBlog,
  getBlog,
  getProfile,
  latestBlogs,
  searchBlogs,
  searchBlogsCount,
  searchUsers,
  trendingBlogs,
  verifyJWT,
} from "../Controllers/blogController.js";

const router = express.Router();

router.route("/latest-blogs").post(latestBlogs);
router.route("/all-latest-blogs-count").post(allLatestBlogs);
router.route("/trending-blogs").get(trendingBlogs);
router.route("/search-blogs").post(searchBlogs);
router.route("/search-blogs-count").post(searchBlogsCount);
router.route("/search-users").post(searchUsers);
router.route("/get-profile").post(getProfile);
router.route("/create-blog").post(verifyJWT, createBlog);
router.route("/get-blog").post(getBlog);

export default router;
