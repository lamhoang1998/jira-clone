import { createSlice } from "@reduxjs/toolkit";

type PopUp = {
  openEditProject: boolean;
  openCreateTask: boolean;
  openEditTask: boolean;
};

const initialState: PopUp = {
  openEditProject: false,
  openCreateTask: false,
  openEditTask: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setOpenModal: (state) => {
      state.openEditProject = true;
    },
    setCloseModal: (state) => {
      state.openEditProject = false;
    },
    setOpenCreateTask: (state) => {
      state.openCreateTask = true;
    },
    setCloseCreateTask: (state) => {
      state.openCreateTask = false;
    },
    setOpenEditTask: (state) => {
      state.openEditTask = true;
    },
    setCloseEditTask: (state) => {
      state.openEditTask = false;
    },
  },
});

export const {
  setOpenModal,
  setCloseModal,
  setOpenCreateTask,
  setCloseCreateTask,
  setOpenEditTask,
  setCloseEditTask,
} = popupSlice.actions;

export default popupSlice.reducer;
