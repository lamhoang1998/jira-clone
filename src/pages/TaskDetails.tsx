import { useParams } from "react-router-dom";
import Comment from "../components/Comment";

function TaskDetails() {
  const { id } = useParams();
  return (
    <div>
      <Comment taskId={id} />
    </div>
  );
}

export default TaskDetails;
