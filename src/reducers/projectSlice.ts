import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectApi } from "../services/apiProject";

type Members = {
  userId: number;
  name: string;
  avatar: string;
};

type Creator = {
  id: number;
  name: string;
};

type Projects = {
  members: Members[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
};

type ProjectState = {
  projects: Projects[];
};

const initialState: ProjectState = {
  projects: [],
};

export const fetchProject = createAsyncThunk(
  "project/fetch",
  async (thunkAPI) => {
    const res = await getProjectApi.getProject();

    return res;
  },
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.projects = action.payload;
    });
  },
});

export default projectSlice.reducer;
