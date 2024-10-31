import { useAppDispatch, useAppSelector } from "../hooks";
import { Avatar } from "antd";
import { useForm } from "react-hook-form";
import { fetchComment, insertComment } from "../reducers/commentSlice";
import { useEffect, useState } from "react";
import EditComment from "./EditComment";

function Comment({ taskId }: { taskId: any }) {
  const dispatch = useAppDispatch();
  const projectDetails = useAppSelector((store) => store.detailsState.details);
  const comments = useAppSelector((store) => store.commentState.commentContent);
  console.log(comments);

  useEffect(
    function () {
      if (taskId) dispatch(fetchComment(taskId));
    },
    [taskId],
  );

  const [comment, setComment] = useState<string>("");

  //handle input

  type Comment = {
    comment: string;
  };

  const commentHandle = useForm<Comment>();

  const { register, handleSubmit } = commentHandle;

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const dataSubmit: { taskId: number | undefined; contentComment: string } = {
      taskId: taskId,
      contentComment: data.comment,
    };
    dispatch(insertComment(dataSubmit));
  });

  const handleComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const dataSubmit: { taskId: number | undefined; contentComment: string } = {
      taskId: taskId,
      contentComment: comment,
    };
    dispatch(insertComment(dataSubmit));
  };

  return (
    <>
      {/* <form
        className="w-1/2 flex flex-col gap-3 ml-8 mt-4"
        onSubmit={onSubmit}
      ></form> */}
      <div className="w-1/2 flex flex-col gap-3 ml-8 mt-4">
        <label
          htmlFor="comment"
          className="w-1/2 text-gray-700 text-sm font-bold"
        >
          Comment
        </label>
        <div className="w-full flex items-center gap-2">
          <Avatar className="w-10 h-10 inline-block text-2xl">L</Avatar>
          <input
            id="comment"
            className="w-full border rounded  p-4 mt-2 text-gray-700 font-normal"
            placeholder="write your commment right here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-red-400 w-14 ml-auto "
          onClick={(e) => {
            handleComment(e);
          }}
        >
          Send
        </button>
        <EditComment taskId={taskId} />
      </div>
      {/* {comments.length > 0 && (
        <ul className="ml-20 mt-4">
          {comments.map((comment) => (
            <li className="flex flex-col">
              <span className="text-xl font-bold text-gray-500 ">
                {comment.contentComment}
              </span>

              <div className="flex text-sm gap-2">
                <span>Edit</span>
                <span>Delete</span>
              </div>
            </li>
          ))}
        </ul>
      )} */}
    </>
  );
}

export default Comment;
