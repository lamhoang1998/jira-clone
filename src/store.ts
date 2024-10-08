import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./reducers/globalSlice";
import projectReducer from "./reducers/projectSlice";
import userReducer from "./reducers/userSlice";
import toastReducer from "./reducers/toastSlice";

export const store = configureStore({
  reducer: {
    globalState: globalReducer,
    projectState: projectReducer,
    userState: userReducer,
    toastState: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
