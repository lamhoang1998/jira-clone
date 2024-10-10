import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { fetchProject } from "../reducers/projectSlice";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function ProjectManagement() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((store) => store.projectState.loading);
  const error = useAppSelector((store) => store.projectState.error);

  console.log(loading);
  console.log(error);

  useEffect(function () {
    dispatch(fetchProject());
  }, []);
  return (
    <>
      {loading && <Loader />}
      {!loading && !error && <h1>Project Management</h1>}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

export default ProjectManagement;
