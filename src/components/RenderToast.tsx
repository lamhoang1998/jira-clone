import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import Toast from "./Toast";
import { setToastState } from "../reducers/toastSlice";
import PopUp from "./PopUp";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";

function RenderToast({ children }: { children: React.ReactNode }) {
  const toast = useAppSelector((store) => store.toastState.toast);
  const openEditProject = useAppSelector(
    (store) => store.popupState.openEditProject,
  );
  const openCreateTask = useAppSelector(
    (store) => store.popupState.openCreateTask,
  );
  const openEditTask = useAppSelector((store) => store.popupState.openEditTask);

  const dispatch = useAppDispatch();
  return (
    <>
      {toast.toastState && (
        <Toast
          message={toast.toastMessage}
          type={toast.toastStatus}
          onClose={() => {
            dispatch(setToastState());
          }}
        />
      )}
      {openEditProject && <PopUp />}
      {openCreateTask && <CreateTask />}
      {openEditTask && <EditTask />}
      {/* <PopUp /> */}
      {children}
    </>
  );
}

export default RenderToast;
