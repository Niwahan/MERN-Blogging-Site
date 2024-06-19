import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  let [comment, setComment] = useState("");

  let { _id: user_id } = blog_author;
  let { userAuth: { access_token } = {} } = useContext(UserContext);
  let {
    notifications,
    notifications: { results },
    setNotification,
  } = notificationData;

  const handleAction = () => {
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
          notification_id,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(({ data }) => {
        setReplying(false);

        results[index].reply = { comment, _id: data._id };
        setNotification({ ...notifications, results });
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
        placeholder="Leave a reply..."
        onChange={(e) => setComment(e.target.value)}
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleAction} className="btn-dark mt-5 px-10">
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
