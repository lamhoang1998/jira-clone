import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type ToastType = {
  toastState: boolean;
  toastMessage: string;
  toastStatus: string;
};

type Toast = {
  toast: ToastType;
};

const initialState: Toast = {
  toast: {
    toastState: false,
    toastMessage: "",
    toastStatus: "",
  },
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToastMessage: (state, action: PayloadAction<ToastType>) => {
      (state.toast.toastState = action.payload.toastState),
        (state.toast.toastMessage = action.payload.toastMessage),
        (state.toast.toastStatus = action.payload.toastStatus);
    },
    setToastState: (state) => {
      state.toast.toastState = false;
    },
  },
});

export const { setToastMessage, setToastState } = toastSlice.actions;

export default toastSlice.reducer;
