import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectApi } from "../services/apiProject";
import { customFetch } from "../services/baseApi";
import { PayloadAction } from "@reduxjs/toolkit";

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
};

const initialState: Contents = {
  contents: [],
};

const url = "/api/Project/getAllProject";

export const fetchProject = createAsyncThunk(
  "project/fetch",
  async (thunkAPI) => {
    const res = await customFetch<AllProjects>(url);

    return res.data.content;
  },
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProject.fulfilled,
      (state, action: PayloadAction<Content[]>) => {
        state.contents = action.payload;
      },
    );
  },
});

export default projectSlice.reducer;
