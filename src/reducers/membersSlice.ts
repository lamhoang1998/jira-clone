import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithToken } from "../services/baseApi";
import { AxiosError } from "axios";
import { fetchProject } from "./projectSlice";
import { setToastMessage } from "./toastSlice";

type Members = {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
};

type InitialState = {
  members: Members[];
  loading: boolean;
  error: Error | null;
};

type Error = {
  errorMessage: string;
  status: number;
};

type FetchMemberApi = {
  statusCode: number;
  message: string;
  content: Members[];
  dateTime: string;
};

type ApiReturn = Members[];

//fetch members
export const fetchMembers = createAsyncThunk<
  ApiReturn,
  string,
  { rejectValue: Error }
>("members/fetch", async (member, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken.get<FetchMemberApi>(
      `/api/Users/getUser?keyword=${member}`,
    );

    console.log(res);

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

//add member to the project
type AddMemberContent = {
  projectId: number;
  userId: number;
};

type AddMembersReturn = {
  statusCode: number;
  message: string;
  content: AddMemberContent[];
  dateTime: string;
};

export const addMember = createAsyncThunk<
  AddMembersReturn,
  AddMemberContent,
  { rejectValue: Error }
>("members/add", async (member, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<AddMembersReturn>(
      "/api/Project/assignUserProject",
      member,
    );
    dispatch(fetchProject());

    console.log(res);

    return res.data;
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
        toastMessage: errorObj.errorMessage as string,
        toastStatus: "ERROR",
      }),
    );
    return rejectWithValue(errorObj as Error);
  }
});

//delete member
type RemoveMemberContent = {
  projectId: number;
  userId: number;
};

type RemoveMembersReturn = {
  statusCode: number;
  message: string;
  content: AddMemberContent[];
  dateTime: string;
};

export const removeMember = createAsyncThunk<
  RemoveMembersReturn,
  RemoveMemberContent,
  { rejectValue: Error }
>("members/remove", async (members, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<RemoveMembersReturn>(
      "/api/Project/removeUserFromProject",
      members,
    );

    dispatch(fetchProject());
    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: "successfully deleted a member",
        toastStatus: "SUCCESS",
      }),
    );

    return res.data;
  } catch (error) {
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
        toastMessage: errorObj.errorMessage as string,
        toastStatus: "ERROR",
      }),
    );

    return rejectWithValue(errorObj as Error);
  }
});

const initialState: InitialState = {
  members: [],
  loading: false,
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchMembers.fulfilled,
        (state, action: PayloadAction<Members[]>) => {
          state.loading = false;
          state.members = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchMembers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.members = [];
        state.error = action.payload;
      });

    builder
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeMember.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default membersSlice.reducer;
