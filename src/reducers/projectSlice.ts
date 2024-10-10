import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectApi } from "../services/apiProject";
import { customFetch } from "../services/baseApi";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export type AllProjects = {
  statusCode: number;
  message: string;
  content: Content[];
  dateTime: string;
};

export type Content = {
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
};

export type Member = {
  userId: number;
  name: string;
  avatar: string;
};

export type Creator = {
  id: number;
  name: string;
};

export type Contents = {
  contents: Content[];
  loading: boolean;
  error: string;
};

type SucessValue = Content[];

type ErrorMessage = string;

const initialState: Contents = {
  contents: [],
  loading: false,
  error: "",
};

const url = "/api/Project/getAllProject";

export const fetchProject = createAsyncThunk<
  SucessValue,
  void,
  { rejectValue: ErrorMessage }
>("project/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await customFetch<AllProjects>(url);

    return res.data.content;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";
    return rejectWithValue(errorMessage as ErrorMessage);
  }
});

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProject.fulfilled,
        (state, action: PayloadAction<Content[]>) => {
          state.loading = false;
          state.contents = action.payload;
          state.error = "";
        },
      )
      .addCase(fetchProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.contents = [];
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
