import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import Toast from "./Toast";
import { setToastState } from "../reducers/toastSlice";
import PopUp from "./PopUp";

function RenderToast({ children }: { children: React.ReactNode }) {
  const toast = useAppSelector((store) => store.toastState.toast);
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
      <PopUp />
      {children}
    </>
  );
}

export default RenderToast;
