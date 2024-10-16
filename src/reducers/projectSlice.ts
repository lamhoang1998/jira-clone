import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithToken } from "../services/baseApi";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setCloseModal } from "./popupSlice";
import { setToastMessage } from "./toastSlice";

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
  projectCreated: ContentCategoryReturn | null;
  loading: boolean;
  error: Error | null;
  projectDetails: {} | ProjectDetails;
  projectCategories: ContentCategory[];
};

type SucessValue = Content[];

type Error = {
  errorMessage: string;
  status: number;
};

const initialState: Contents = {
  contents: [],
  projectCreated: null,
  loading: false,
  error: null,
  projectDetails: {},
  projectCategories: [],
};

const url = "/api/Project/getAllProject";

//get all project

export const fetchProject = createAsyncThunk<
  SucessValue,
  void,
  { rejectValue: Error }
>("project/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken.get<AllProjects>(url);
    return res.data.content;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";

    const status =
      error instanceof AxiosError ? error.status : "Something went wrong";
    const errorObj = { errorMessage: errorMessage, status: status };
    return rejectWithValue(errorObj as Error);
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
  categoryId: number;
};

//send formdata to the api to update projects

const putUrl = "/api/Project/updateProject";

export const updateProject = createAsyncThunk<
  ProjectSentBack,
  ProjectUpdate,
  { rejectValue: Error }
>("project/update ", async (projectDetails, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.put<PutData>(
      `/api/Project/updateProject?projectId=${projectDetails.id}`,
      projectDetails,
    );
    dispatch(setCloseModal());
    dispatch(fetchProject());
    return res.data.content;
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";

    const status =
      error instanceof AxiosError ? error.status : "Something went wrong";
    const errorObj = { errorMessage: errorMessage, status: status };

    dispatch(setCloseModal());

    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: errorMessage as string,
        toastStatus: "ERROR",
      }),
    );

    return rejectWithValue(errorObj as Error);
  }
});

// get project category

type ContentCategory = {
  id: number;
  projectCategoryName: string;
};

type ContentCategoryReturn = ContentCategory[];

type CategoryReturn = {
  statusCode: number;
  content: ContentCategory[];
  dateTime: string;
};

export const fetchProjectCategory = createAsyncThunk<
  ContentCategoryReturn,
  void,
  { rejectValue: Error }
>("project/category", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken.get<CategoryReturn>(
      "/api/ProjectCategory",
    );
    return res.data.content;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";

    const status =
      error instanceof AxiosError ? error.status : "Something went wrong";
    const errorObj = { errorMessage: errorMessage, status: status };
    return rejectWithValue(errorObj as Error);
  }
});

//create project authorize
type CreatorReturn = {
  statusCode: number;
  message: string;
  content: CreatorContentReturn;
  dateTime: string;
};

type CreatorContentReturn = {
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
  deleted: boolean;
  creator: number;
};

type CreatorSubmitted = {
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
};

export const createProject = createAsyncThunk<
  CreatorContentReturn,
  CreatorSubmitted,
  { rejectValue: Error }
>("project/create", async (projectCreated, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<CreatorReturn>(
      "/api/Project/createProjectAuthorize",
      projectCreated,
    );
    console.log(res);
    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: "successfully updated the projects",
        toastStatus: "SUCCESS",
      }),
    );
    return res.data.content;
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";

    const status =
      error instanceof AxiosError ? error.status : "Something went wrong";
    const errorObj = { errorMessage: errorMessage, status: status };

    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: errorMessage as string,
        toastStatus: "ERROR",
      }),
    );

    return rejectWithValue(errorObj as Error);
  }
});

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    getProjectDetails: (state, action) => {
      state.projectDetails = action.payload;
    },
    setProjectCreated: (state) => {
      state.projectCreated = null;
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
          state.error = null;
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

    builder
      .addCase(fetchProjectCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProjectCategory.fulfilled,
        (state, action: PayloadAction<ContentCategory[]>) => {
          state.loading = false;
          state.projectCategories = action.payload;
          state.error = null;
        },
      )
      .addCase(
        fetchProjectCategory.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.projectCategories = [];
          state.error = action.payload;
        },
      );

    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.projectCreated = action.payload;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { getProjectDetails, setProjectCreated } = projectSlice.actions;

export default projectSlice.reducer;
