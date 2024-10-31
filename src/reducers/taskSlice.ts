import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithToken } from "../services/baseApi";
import { AxiosError } from "axios";
import { setToastMessage } from "./toastSlice";
import { fetchProjectDetails } from "./detailsSlice";
import { setCloseCreateTask, setCloseEditTask } from "./popupSlice";

type Error = {
  errorMessage: string;
  status: number;
};

//fetch task type
type TaskTypeContent = {
  id: number;
  taskType: string;
};

type TaskTypeReturn = {
  statusCode: number;
  message: string;
  content: TaskTypeContent[];
  dateTime: string;
};

type TaskTypeState = TaskTypeContent[];

export const fetchTaskType = createAsyncThunk<
  TaskTypeState,
  void,
  { rejectValue: Error }
>("task/tasktype", async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.get<TaskTypeReturn>(
      "/api/TaskType/getAll",
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

//fetch priority

type PriorityContent = {
  priorityId: number;
  priority: string;
  description: string;
  deleted: boolean;
  alias: string;
};

type PriorityReturn = {
  statusCode: number;
  message: string;
  content: PriorityContent[];
  dateTime: string;
};

type PriorityState = PriorityContent[];

export const fetchPriority = createAsyncThunk<
  PriorityState,
  void,
  { rejectValue: Error }
>("task/priority", async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.get<PriorityReturn>(
      "/api/Priority/getAll",
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

//fetch status
type StatusContent = {
  statusId: string;
  statusName: string;
  alias: string;
  deleted: string;
};

type StatusReturn = {
  statusCode: number;
  content: StatusContent[];
  dateTime: string;
};

type StatusState = StatusContent[];

export const fetchStatus = createAsyncThunk<
  StatusState,
  void,
  { rejectValue: Error }
>("task/status", async (_, { rejectWithValue }) => {
  try {
    const res = fetchWithToken.get<StatusReturn>("/api/Status/getAll");

    return (await res).data.content;
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

// create task

type TaskSubmit = {
  listUserAsign: number[];
  taskName: string;
  description: string;
  statusId: number;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: number;
  typeId: number;
  priorityId: number;
};

type TaskContentReturn = {
  taskId: number;
  taskName: string;
  alias: string;
  description: string;
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: number;
  typeId: number;
  deleted: boolean;
  reporterId: number;
  priorityId: number;
};

type TaskReturn = {
  statusCode: number;
  message: string;
  content: TaskContentReturn;
  dateTime: string;
};

export const createTask = createAsyncThunk<
  TaskContentReturn,
  TaskSubmit,
  { rejectValue: Error }
>("task/create", async (taskSubmit, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<TaskReturn>(
      "/api/Project/createTask",
      taskSubmit,
    );
    dispatch(fetchProjectDetails(taskSubmit.projectId.toString()));
    dispatch(setCloseCreateTask());
    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: "successfully create a project",
        toastStatus: "SUCCESS",
      }),
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

// fetch task details

type TaskDetailContent = {
  priorityTask: {
    priorityId: number;
    priority: string;
  };
  taskTypeDetail: {
    id: number;
    taskType: string;
  };
  assigness: {
    id: number;
    avatar: string;
    name: string;
    alias: string;
  }[];
  lstComment: any[];
  taskId: number;
  taskName: string;
  alias: string;
  description: string;
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  typeId: number;
  priorityId: number;
  projectId: number;
};

type TaskDetailReturn = {
  statusCode: number;
  message: string;
  content: TaskDetailContent;
  dateTime: string;
};

export const fetchTaskDetail = createAsyncThunk<
  TaskDetailContent,
  number,
  { rejectValue: Error }
>("task/taskDetail", async (id, { rejectWithValue, dispatch }) => {
  try {
    const res =
      fetchWithToken.get<TaskDetailReturn>(`https://jiranew.cybersoft.edu.vn/api/Project/getTaskDetail?taskId=${id}
`);
    console.log(res);

    return (await res).data.content;
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

// edit task

type EditTaskContent = {
  taskId: number;
  taskName: string;
  alias: string;
  description: string;
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: number;
  typeId: number;
  deleted: boolean;
  reporterId: number;
  priorityId: number;
};

type EditTaskReturn = {
  statusCode: number;
  message: string;
  content: EditTaskContent;
  dateTime: string;
};

type TaskSubmitContent = {
  listUserAsign: number[];
  taskId: number | undefined;
  taskName: string;
  description: string;
  statusId: number;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: number | undefined;
  typeId: number;
  priorityId: number;
};

export const editTask = createAsyncThunk<
  EditTaskContent,
  TaskSubmitContent,
  { rejectValue: Error }
>("task/edit", async (taskSubmit, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.post<EditTaskReturn>(
      "/api/Project/updateTask",
      taskSubmit,
    );

    console.log(res);
    dispatch(setCloseEditTask());

    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: "successfully edited the project",
        toastStatus: "SUCCESS",
      }),
    );

    dispatch(fetchProjectDetails((taskSubmit.projectId as number).toString()));

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

//delete task

type DeleteTaskReturn = {
  statusCode: number;
  message: string;
  content: string;
  dateTime: string;
};

export const deleteTask = createAsyncThunk<
  DeleteTaskReturn,
  { taskId: number; projectId: number | string },
  { rejectValue: Error }
>("task/delete", async (taskId, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetchWithToken.delete<DeleteTaskReturn>(
      `/api/Project/removeTask?taskId=${taskId.taskId}`,
    );
    dispatch(
      setToastMessage({
        toastState: true,
        toastMessage: "successfully removed the project",
        toastStatus: "SUCCESS",
      }),
    );

    dispatch(fetchProjectDetails(taskId.projectId.toString()));
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
        toastMessage: errorMessage as string,
        toastStatus: "ERROR",
      }),
    );

    return rejectWithValue(errorObj as Error);
  }
});

// update task status
type UpdateStatusReturn = {
  statusCode: number;
  message: string;
  content: string;
  dateTime: string;
};

type UpdateStatusReceived = {
  taskId: number;
  statusId: number;
  projectId: string;
};

export const updateStatus = createAsyncThunk<
  UpdateStatusReturn,
  UpdateStatusReceived,
  { rejectValue: Error }
>(
  "task/updateStatus",
  async (updateStatusReceived, { rejectWithValue, dispatch }) => {
    const updateData: { taskId: number; statusId: number } = {
      taskId: updateStatusReceived.taskId,
      statusId: updateStatusReceived.statusId,
    };
    try {
      const res = await fetchWithToken.put<UpdateStatusReturn>(
        `/api/Project/updateStatus`,
        updateData,
      );

      console.log(res);
      dispatch(fetchProjectDetails(updateStatusReceived.projectId));

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
          toastMessage: errorMessage as string,
          toastStatus: "ERROR",
        }),
      );

      return rejectWithValue(errorObj as Error);
    }
  },
);

//initial state
type InitialState = {
  loading: boolean;
  taskType: TaskTypeContent[];
  priority: PriorityState;
  taskCreated: TaskContentReturn | null;
  taskDetail: TaskDetailContent | null;
  status: StatusState;
  error: Error | null;
};

const initialState: InitialState = {
  loading: true,
  taskType: [],
  priority: [],
  taskCreated: null,
  taskDetail: null,
  status: [],
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTaskType.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTaskType.fulfilled,
        (state, action: PayloadAction<TaskTypeState>) => {
          state.loading = false;
          state.taskType = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchTaskType.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.taskType = [];
        state.error = action.payload;
      });
    builder
      .addCase(fetchPriority.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPriority.fulfilled,
        (state, action: PayloadAction<PriorityState>) => {
          state.loading = false;
          state.priority = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchPriority.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.priority = [];
        state.error = action.payload;
      });
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchStatus.fulfilled,
        (state, action: PayloadAction<StatusState>) => {
          state.loading = false;
          state.status = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.status = [];
        state.error = action.payload;
      });
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createTask.fulfilled,
        (state, action: PayloadAction<TaskContentReturn>) => {
          state.loading = false;
          state.taskCreated = action.payload;
          state.error = null;
        },
      )
      .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchTaskDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTaskDetail.fulfilled,
        (state, action: PayloadAction<TaskDetailContent>) => {
          state.loading = false;
          state.taskDetail = action.payload;
          state.error = null;
        },
      )
      .addCase(
        fetchTaskDetail.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.taskDetail = null;
          state.error = action.payload;
        },
      );
    builder
      .addCase(editTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
