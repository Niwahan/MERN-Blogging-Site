import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { storage } from "../common/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

export default function BLogEditor() {
  let {
    blog,
    blog: { title, banner, content, tags, description },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome blog",
      })
    );
  }, []);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    if (!img) {
      // Immediately show error if no file is selected
      return toast.error("No Image Selected");
    }

    let loadingToast = toast.loading("Uploading...");

    const imageRef = ref(storage, `Banners/${img.name + v4().substring(0, 4)}`);
    // Upload the image to Firebase Storage
    uploadBytes(imageRef, img)
      .then((snapshot) => {
        // Get the download URL for the uploaded image
        getDownloadURL(snapshot.ref).then((url) => {
          toast.dismiss(loadingToast);
          toast.success("Image Uploaded Successfully");
          setBlog({ ...blog, banner: url });
        });
      })
      .catch((err) => {
        // Handle any errors that occur while uploading the image
        toast.dismiss(loadingToast);
        return toast.error(err);
      });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // Enter Key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollheight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = () => {
    console.log(textEditor);
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it.");
    }
    if (!title.length) {
      return toast.error("Write blog title to publish");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px]">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80%">
              <label htmlFor="uploadBanner">
                <img src={banner || defaultBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className=" font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
