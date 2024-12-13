import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithToken } from "../services/baseApi";
import { AxiosError } from "axios";

type Error = {
  errorMessage: string;
  status: number;
};

// fetch comments

type UserCommentContent = { userId: number; name: string; avatar: string };

type GetCommentContent = {
  user: UserCommentContent;
  id: number;
  userId: number;
  taskId: number;
  contentComment: string;
  deleted: boolean;
  alias: string;
};

type GetCommentReturn = {
  statusCode: number;
  message: string;
  content: GetCommentContent[];
  dateTime: string;
};

type GetCommentState = GetCommentContent[];

export const fetchComment = createAsyncThunk<
  GetCommentState,
  any,
  { rejectValue: Error }
>("comment/fetch", async (taskId, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.get<GetCommentReturn>(
      `/api/Comment/getAll?taskId=${taskId}`,
    );

    console.log(res);

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

    return rejectWithValue(errorObj as Error);
  }
});

// submit comments to the api

type InsertCommentContent = {
  id: number;
  userId: number;
  taskId: number;
  contentComment: string;
  deleted: boolean;
  alias: string;
};

type InsertCommentReturn = {
  statusCode: number;
  message: string;
  content: InsertCommentContent;
  dateTime: string;
};

export const insertComment = createAsyncThunk<
  InsertCommentContent,
  { taskId: number | undefined; contentComment: string },
  { rejectValue: Error }
>("comment/insert", async (commentData, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<InsertCommentReturn>(
      `/api/Comment/insertComment`,
      commentData,
    );

    console.log(res);
    dispatch(fetchComment(commentData.taskId));

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

    return rejectWithValue(errorObj as Error);
  }
});

//edit comment

type EditCommentContent = {
  id: number;
  userId: number;
  taskId: number;
  contentComment: string;
  deleted: boolean;
  alias: string;
};

type EditCommentReturn = {
  statusCode: number;
  message: string;
  content: EditCommentContent;
  dateTime: string;
};

export const editComment = createAsyncThunk<
  EditCommentContent,
  { id: number; contentComment: string; taskId: number },
  { rejectValue: Error }
>("comment/edit", async (commentData, { rejectWithValue, dispatch }) => {
  const { id, contentComment, taskId } = commentData;
  try {
    const res = await fetchWithToken.put<EditCommentReturn>(
      `/api/Comment/updateComment?id=${id}&contentComment=${contentComment}`,
    );
    console.log(res);
    dispatch(fetchComment(taskId));
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

    return rejectWithValue(errorObj as Error);
  }
});

//delete comment

type DeleteCommentReturn = {
  statusCode: number;
  message: string;
  content: string;
  dateTime: string;
};

export const deleteComment = createAsyncThunk<
  DeleteCommentReturn,
  { commentId: number; taskId: number | undefined },
  { rejectValue: Error }
>("comment/delete", async (commentId, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.delete<DeleteCommentReturn>(
      `/api/Comment/deleteComment?idComment=${commentId.commentId}`,
    );

    dispatch(fetchComment(commentId.taskId));

    return res.data;
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

//comment slice

type InitialState = {
  loading: boolean;
  error: Error | null;
  commentContent: GetCommentState;
};

const initialState: InitialState = {
  loading: false,
  error: null,
  commentContent: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(insertComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchComment.fulfilled,
        (state, action: PayloadAction<GetCommentState>) => {
          state.loading = false;
          state.commentContent = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.commentContent = [];
        state.error = action.payload;
      });
    builder
      .addCase(editComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(editComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(
      deleteComment.rejected,
      (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      },
    );
  },
});

export default commentSlice.reducer;
