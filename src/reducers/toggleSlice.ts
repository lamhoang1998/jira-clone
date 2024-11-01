import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InitialStateTypes = {
  isSidebarCollapsed: boolean;
};

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
};

export const toggleSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed } = toggleSlice.actions;
export default toggleSlice.reducer;
