import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteComment, editComment } from "../reducers/commentSlice";

function EditComment({ taskId }: { taskId: any }) {
  console.log("taskId", taskId);

  const comments = useAppSelector((store) => store.commentState.commentContent);

  return (
    <>
      <ul className="ml-20 mt-4 flex flex-col gap-2">
        {comments.map((comment) => (
          <li className="flex flex-col">
            <Comment
              content={comment.contentComment}
              Id={comment.id}
              taskId={taskId}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function Comment({
  content,
  Id,
  taskId,
}: {
  content: any;
  Id: any;
  taskId: any;
}) {
  const dispatch = useAppDispatch();
  const taskDetails = useAppSelector((store) => store.taskState.taskDetail);
  console.log("task", taskDetails);

  let taskContent: any;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>("");

  if (isEdit) {
    taskContent = (
      <>
        <input
          className="text-xl font-bold text-gray-500 "
          defaultValue={content}
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
          }}
        />
        <div className="flex text-sm gap-2">
          <span
            onClick={() => {
              console.log(editContent);
              dispatch(
                editComment({
                  id: Id,
                  contentComment: editContent,
                  taskId: taskId,
                }),
              );
              setIsEdit(false);
            }}
            className="cursor-pointer"
          >
            Save
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              dispatch(
                deleteComment({ commentId: Id, taskId: taskDetails?.taskId }),
              );
            }}
          >
            Delete
          </span>
        </div>
      </>
    );
  } else {
    taskContent = (
      <>
        <span className="text-xl font-bold text-gray-500 ">{content}</span>
        <div className="flex text-sm gap-2">
          <span
            className="cursor-pointer"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              dispatch(
                deleteComment({ commentId: Id, taskId: taskDetails?.taskId }),
              );
            }}
          >
            Delete
          </span>
        </div>
      </>
    );
  }

  return <>{taskContent}</>;
}

export default EditComment;
