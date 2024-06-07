import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setIsReplying,
}) => {
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);
  const [comment, setComment] = useState("");

  const handleAction = () => {
    if (!access_token) {
      return toast.error("Please login to comment");
    }

    if (!comment.length) {
      return toast.error("Write something to comment");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/add-comment",
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(({ data }) => {
        setComment("");
        data.commented_by = {
          personal_info: { username, profile_img, fullname },
        };

        let newCommentArr;

        if (replyingTo) {
          commentsArr[index].children.push(data._id);

          data.childrenLevel = commentsArr[index].childrenLevel + 1;
          data.parentIndex = index;

          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, data);

          newCommentArr = commentsArr;

          setIsReplying(false)

        } else {
          data.childrenLevel = 0;

          newCommentArr = [data, ...commentsArr];
        }

        let parentCommentIncVal = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments: total_parent_comments + parentCommentIncVal,
          },
        });
        setTotalParentCommentsLoaded((preVal) => preVal + parentCommentIncVal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a comment..."
        onChange={(e) => setComment(e.target.value)}
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleAction} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentField;
