import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { storage } from "../common/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Toaster, toast } from "react-hot-toast";

export default function BLogEditor() {
  const [banner, setBanner] = useState(defaultBanner);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    if (!img) {
      // Immediately show error if no file is selected
      return toast.error("No Image Selected");
    }

      let loadingToast = toast.loading("Uploading...");

      const imageRef = ref(
        storage,
        `Banners/${img.name + v4().substring(0, 4)}`
      );
      // Upload the image to Firebase Storage
      uploadBytes(imageRef, img)
        .then((snapshot) => {
          // Get the download URL for the uploaded image
          getDownloadURL(snapshot.ref).then((url) => {
            // Update the banner state with the new URL
            setBanner(url);
            // Alert and log the imageList
            toast.dismiss(loadingToast);
            toast.success("Image Uploaded Successfully");
          });
        })
        .catch((err) => {
          // Handle any errors that occur while uploading the image
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px]">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80%">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
