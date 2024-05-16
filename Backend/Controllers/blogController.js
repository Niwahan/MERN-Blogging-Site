import "dotenv/config";
import admin from "firebase-admin";
import serviceAccount from "../firebaseConfig.json" assert { type: "json" };
import { nanoid } from "nanoid";
import {} from "firebase";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
};

export const getUploadURL = async (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
};
