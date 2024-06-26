import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
dotnet.config();
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(
  cors({
    origin: [
      "https://niwa-blogsite.netlify.app",
      "https://mern-blogging-site.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handling CORS preflight requests
server.options(
  "*",
  cors({
    origin: [
      "https://niwa-blogsite.netlify.app",
      "https://mern-blogging-site.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

mongoose.connect(process.env.DB_Location, {
  autoIndex: true,
});

server.use("/api/users", userRoutes);
server.use("/api/blogs", blogRoutes);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
