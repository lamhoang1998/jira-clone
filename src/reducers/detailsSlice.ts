import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithToken } from "../services/baseApi";
import { AxiosError } from "axios";

type Error = {
  errorMessage: string | undefined;
  status: number | string | undefined;
};

// get project details

type LstTaskDetail = {
  alias: string;
  assigness: { id: number; avatar: string; name: string; alias: string }[];
  description: string;
  lstComment: [];
  originalEstimate: number;
  priorityId: number;
  priorityTask: { priorityId: number; priority: "string" };
  projectId: number;
  statusId: number;
  taskId: number;
  taskName: string;
  taskTypeDetail: { id: number; taskType: "string" };
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
};

export type LstTask = {
  lstTaskDeTail: LstTaskDetail[];
  statusId: string;
  statusName: string;
  alias: string;
};

export type Member = {
  userId: number;
  name: string;
  avatar: string;
  email: any;
  phoneNumber: any;
};

export type Creator = {
  id: number;
  name: string;
};

export type ProjectCategory = {
  id: number;
  name: string;
};

type Details = {
  lstTask: LstTask[];
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  projectCategory: ProjectCategory;
  alias: string;
};

type DetailReturn = {
  statusCode: number;
  message: string;
  content: Details;
  dateTime: string;
};

export const fetchProjectDetails = createAsyncThunk<
  Details,
  string,
  { rejectValue: Error }
>("details/fetch", async (id, { rejectWithValue, dispatch }) => {
  try {
    const res = fetchWithToken.get<DetailReturn>(
      `/api/Project/getProjectDetail?id=${id}`,
    );

    return (await res).data.content;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.statusText
        : "Something went wrong";

    const status =
      error instanceof AxiosError ? error.status : "Something went wrong";
    const errorObj: Error = { errorMessage: errorMessage, status: status };
    return rejectWithValue(errorObj);
  }
});

//detail slice

type InitialState = {
  details: Details | null;
  loading: boolean;
  error: Error | null;
};

const initialState: InitialState = {
  details: null,
  loading: false,
  error: null,
};

const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProjectDetails.fulfilled,
        (state, action: PayloadAction<Details>) => {
          state.loading = false;
          state.details = action.payload;
          state.error = null;
        },
      )
      .addCase(
        fetchProjectDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.details = null;
          state.error = action.payload;
        },
      );
  },
});

export default detailSlice.reducer;
