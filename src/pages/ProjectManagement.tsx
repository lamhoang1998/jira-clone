import { useAppDispatch } from "../hooks";
import { useEffect } from "react";
import { fetchProject } from "../reducers/projectSlice";

function ProjectManagement() {
  const dispatch = useAppDispatch();

  useEffect(function () {
    dispatch(fetchProject());
  }, []);
  return <div>ProjectManagement</div>;
}

export default ProjectManagement;
