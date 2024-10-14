import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectApi } from "../services/apiProject";
import { customFetch, fetchWithToken } from "../services/baseApi";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { action } from "../pages/Login";

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

export type ProjectDetails = {
  categoryName: string;
  description: string;
  id: number;
  projectName: string;
};

export type Contents = {
  contents: Content[];
  loading: boolean;
  error: string;
  projectDetails: {} | ProjectDetails;
};

type SucessValue = Content[];

type ErrorMessage = string;

const initialState: Contents = {
  contents: [],
  loading: false,
  error: "",
  projectDetails: {},
};

const url = "/api/Project/getAllProject";

export const fetchProject = createAsyncThunk<
  SucessValue,
  void,
  { rejectValue: ErrorMessage }
>("project/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken.get<AllProjects>(url);

    return res.data.content;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";
    return rejectWithValue(errorMessage as ErrorMessage);
  }
});

type ProjectSentBack = {
  id: number;
  projectName: string;
  description: string;
  categoryId: string;
  alias: string;
  deleted: boolean;
  creator: number;
};

type PutData = {
  statusCode: number;
  message: string;
  content: ProjectSentBack;
  dateTime: string;
};

type ProjectUpdate = {
  id: number;
  projectName: string;
  creator: number;
  description: string;
  categoryId: string;
};

const putUrl = "/api/Project/updateProject";

export const updateProject = createAsyncThunk<
  ProjectSentBack,
  ProjectUpdate,
  { rejectValue: ErrorMessage }
>("project/update ", async (projectDetails, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken.put<PutData>(
      `/api/Project/updateProject?projectId=${projectDetails.id}`,
      projectDetails,
    );
    console.log(res);

    return res.data.content;
  } catch (error) {
    console.log(error);
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
  reducers: {
    getProjectDetails: (state, action) => {
      state.projectDetails = action.payload;
    },
  },
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

    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.contents = [];
        state.error = action.payload;
      });
  },
});

export const { getProjectDetails } = projectSlice.actions;

export default projectSlice.reducer;
