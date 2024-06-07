import express from "express";
import {
  addComment,
  allLatestBlogs,
  createBlog,
  deleteComment,
  getBlog,
  getBlogComments,
  getProfile,
  getReplies,
  isLikedByUser,
  latestBlogs,
  likeBlog,
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
router.route("/like-blog").post(verifyJWT, likeBlog);
router.route("/isliked-by-user").post(verifyJWT, isLikedByUser);
router.route("/add-comment").post(verifyJWT, addComment);
router.route("/get-blog-comments").post(getBlogComments);
router.route("/get-replies").post(getReplies);
router.route("/delete-comment").post(verifyJWT, deleteComment);

export default router;
