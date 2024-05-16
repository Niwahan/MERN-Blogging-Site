import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { storage } from "../common/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const uploadImage = (img) => {
  return new Promise((resolve, reject) => {
    if (!img) {
      // Immediately show error if no file is selected
      reject("No Image Selected");
      return;
    }

    const imageRef = ref(storage, `Blog/${img.name + v4().substring(0, 4)}`);
    // Upload the image to Firebase Storage
    uploadBytes(imageRef, img)
      .then((snapshot) => {
        // Get the download URL for the uploaded image
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      })
      .catch((err) => {
        // Handle any errors that occur while uploading the image
        reject(err);
      });
  });
};

const uploadImageByFile = (file) => {
  return uploadImage(file).then((url) => {
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};

const uploadImageByURL = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  link: Link,
  list: { class: List, inlineToolbar: true },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeHolder: "Type Heading....",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  quote: { class: Quote, inlineToolbar: true },
  marker: Marker,
  inlineCode: InlineCode,
};
