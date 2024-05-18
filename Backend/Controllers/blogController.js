import "dotenv/config";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access Token is invalid" });
    }

    req.user = user.id;
    next();
  });
};

export const createBlog = async (req, res) => {
  let authorId = req.user;

  let { title, description, banner, tags, content, draft } = req.body;

  if (!title.length) {
    return res
      .status(403)
      .json({ error: "You must providea title to publish the blog" });
  }
  if (!description.length || description.length > 200) {
    return res.status(403).json({
      error:
        "You must provide description to publish the blog, Maximum characters 200",
    });
  }

  if (!banner.length) {
    return res
      .status(403)
      .json({ error: "You must provide blog banner to publish the blog" });
  }
  if (!content.blocks.length) {
    return res.status(403).json({
      error: "You must provide some blog content to publish the blog",
    });
  }

  if (!tags.length || tags.length > 10) {
    return res.status(403).json({
      error: "You must provide some tags to publish the blog, Maximum of 10",
    });
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]+/g, "-")
      // .replace(/\s+/g, "-")
      .trim() + nanoid();

  let blog = new Blog({
    title,
    des: description,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;

      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { "blogs": blog._id },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          console.error("Update error:", err);
          return res
            .status(500)
            .json({ error: "Failed to update total posts number." });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};
