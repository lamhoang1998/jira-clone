import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

type PopUp = {
  open: boolean;
};

const initialState: PopUp = {
  open: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setOpenModal: (state) => {
      state.open = true;
    },
    setCloseModal: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenModal, setCloseModal } = popupSlice.actions;

export default popupSlice.reducer;
