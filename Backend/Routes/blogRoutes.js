import express from "express";
import { getUploadURL } from "../Controllers/blogController";

const router = express.Router();

router.route("/get-upload-URL").get(getUploadURL);


export default router;