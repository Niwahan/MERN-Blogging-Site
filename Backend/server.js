import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./Routes/userRoutes.js";

const server = express();
const PORT = 3000;

server.use(express.json());

mongoose.connect(process.env.DB_Location, {
  autoIndex: true,
});

server.use("/api/users", userRoutes);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
