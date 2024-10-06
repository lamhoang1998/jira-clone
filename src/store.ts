import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./reducers/globalSlice";

export const store = configureStore({
  reducer: { globalState: globalReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
