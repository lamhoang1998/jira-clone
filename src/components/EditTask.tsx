import { Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setCloseEditTask } from "../reducers/popupSlice";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  editTask,
  fetchPriority,
  fetchStatus,
  fetchTaskType,
} from "../reducers/taskSlice";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import Comment from "./Comment";
function EditTask() {
  const dispatch = useAppDispatch();

  //selector
  const openEditTask = useAppSelector((store) => store.popupState.openEditTask);
  const taskDetails = useAppSelector((store) => store.taskState.taskDetail);
  console.log("taskDetails", taskDetails);
  const status = useAppSelector((store) => store.taskState.status);
  const taskPriority = useAppSelector((store) => store.taskState.priority);
  const taskType = useAppSelector((store) => store.taskState.taskType);
  const projectMembers = useAppSelector(
    (store) => store.detailsState.details?.members,
  );

  //fill the form in the first render and get data to fill the select field

  const members = taskDetails?.assigness.map((assign) => ({
    label: assign.name,
    value: assign.name,
  }));

  const projectMembersOption = projectMembers?.map((member) => ({
    label: member.name,
    value: member.name,
  }));

  //Mapper
  const statusMapEdit = new Map();

  const statusMapValidate = new Map();

  const projectMemberSubmit = new Map();

  const typeMap = new Map();

  const priorityMap = new Map();

  projectMembers?.forEach((member) =>
    projectMemberSubmit.set(member.name, member.userId),
  );

  status.forEach((stt) => statusMapEdit.set(stt.statusName, stt.statusId));

  status.forEach((stt) => statusMapValidate.set(stt.statusId, stt.statusName));

  taskType.forEach((type) => typeMap.set(type.taskType, type.id));

  taskPriority.forEach((task) =>
    priorityMap.set(task.priority, task.priorityId),
  );

  useEffect(function () {
    dispatch(fetchTaskType());
    dispatch(fetchPriority());
    dispatch(fetchStatus());
  }, []);

  useEffect(
    function () {
      reset({
        taskName: taskDetails?.taskName,
        status: statusMapValidate?.get(taskDetails?.statusId),
        priority: taskDetails?.priorityTask.priority,
        taskType: taskDetails?.taskTypeDetail.taskType,
        originalEstimate: taskDetails?.originalEstimate,
        member: members,
        timeSpent: taskDetails?.timeTrackingSpent,
        timeRemaining: taskDetails?.timeTrackingRemaining,
        description: taskDetails?.description,
      });
    },
    [taskDetails],
  );

  //handle form
  type EditTaskData = {
    taskName: string;
    status: string;
    priority: string;
    taskType: string;
    originalEstimate: number;
    member: { label: string; value: string }[];
    timeSpent: number;
    timeRemaining: number;
    description: string;
  };

  const formDetails = useForm<EditTaskData>();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
  } = formDetails;

  // watch timetracking and fill the fields in the first render
  const timeSpent = watch("timeSpent");
  const timeRemaining = watch("timeRemaining");
  const timeSpentValue = register("timeSpent", {
    required: "This field is required",
  });

  const timeRemainingValue = register("timeRemaining", {
    required: "This fiedl is required",
  });

  // create state to update time tracking and time remaining from next renders

  const [timeTracking, setTimeTracking] = useState<{
    timeSpent: number;
    timeRemaining: number;
  }>({
    timeSpent: 0,
    timeRemaining: 0,
  });

  const onSubmit = handleSubmit((data) => {
    console.log("data", data);
    type DataSubmit = {
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

    const listUserAsign = data.member.map((mem) =>
      projectMemberSubmit.get(mem.label),
    );

    const statusId = +statusMapEdit.get(data.status);

    const typeId = typeMap.get(data.taskType);

    const priorityId = priorityMap.get(data.priority);

    const dataSubmit: DataSubmit = {
      listUserAsign: listUserAsign,
      taskId: taskDetails?.taskId,
      taskName: data.taskName,
      description: data.description,
      statusId: statusId,
      originalEstimate: data.originalEstimate,
      timeTrackingSpent: data.timeSpent,
      timeTrackingRemaining: data.timeRemaining,
      projectId: taskDetails?.projectId,
      typeId: typeId,
      priorityId: priorityId,
    };
    dispatch(editTask(dataSubmit));
  });

  return (
    <>
      {taskDetails && (
        <Modal
          title={<h2 className="text-3xl font-bold">Edit tasks</h2>}
          open={openEditTask}
          width={1000}
          onCancel={() => {
            dispatch(setCloseEditTask());
          }}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <div className="flex gap-5 w-full mt-2">
              <label className="text-gray-700 text-sm font-bold flex-1 w-1/2">
                Task name
                <input
                  className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
                  {...register("taskName", {
                    required: "This field is required",
                  })}
                ></input>
                {errors.taskName && (
                  <span className="text-red-500">
                    {errors.taskName.message}
                  </span>
                )}
              </label>
              <label className="text-gray-700 text-sm font-bold flex-1 w-1/2">
                Status
                <select
                  className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
                  {...register("status", {
                    required: "This field is required",
                  })}
                >
                  <option value="">choose one</option>
                  {status?.map((stt, index) => (
                    <option value={stt.statusName} key={index}>
                      {stt.statusName}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <span className="text-red-500">{errors.status.message}</span>
                )}
              </label>
            </div>
            <div className="flex gap-5 w-full mt-2">
              <label className="text-gray-700 text-sm font-bold flex-1 w-1/2">
                Priority
                <select
                  className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
                  {...register("priority", {
                    required: "This field is required",
                  })}
                >
                  <option value="">choose one</option>
                  {taskPriority?.map((priority, index) => (
                    <option value={priority.priority} key={index}>
                      {priority.priority}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <span className="text-red-500">
                    {errors.priority.message}
                  </span>
                )}
              </label>
              <label className="text-gray-700 text-sm font-bold flex-1 w-1/2">
                Task types
                <select
                  className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
                  {...register("taskType", {
                    required: "This field is required",
                  })}
                >
                  <option value="">choose one</option>
                  {taskType?.map((task, index) => (
                    <option value={task.taskType} key={index}>
                      {task.taskType}
                    </option>
                  ))}
                </select>
                {errors.taskType && (
                  <span className="text-red-500">
                    {errors.taskType.message}
                  </span>
                )}
              </label>
            </div>
            <div className="flex gap-5 w-full mt-2">
              <label className="text-gray-700 text-sm font-bold flex-1 w-1/2">
                Original estimate
                <input
                  type="number"
                  className="w-full border rounded p-2  text-gray-700 font-normal"
                  {...register("originalEstimate", {
                    required: "This field is required",
                  })}
                />
                {errors.originalEstimate && (
                  <span className="text-red-500">
                    {errors.originalEstimate.message}
                  </span>
                )}
              </label>
              <label className="w-[50%] text-gray-700 text-sm font-bold ">
                Time tracking
                <input
                  type="range"
                  min={0}
                  max={
                    timeTracking.timeSpent === 0 &&
                    timeTracking.timeRemaining === 0
                      ? timeSpent + timeRemaining
                      : timeTracking.timeSpent + timeTracking.timeRemaining
                  }
                  value={
                    timeTracking.timeSpent === 0
                      ? timeSpent
                      : timeTracking.timeSpent
                  }
                  defaultValue={30}
                  className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
                />
              </label>
            </div>
            <div className="flex gap-5 w-full mt-2">
              <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
                Membmer
                <Controller
                  control={control}
                  name="member"
                  rules={{ required: "This field is required" }}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        options={projectMembersOption}
                        isMulti={true}
                      />
                    );
                  }}
                />
                {errors.member && (
                  <span className="text-red-500">{errors.member.message}</span>
                )}
              </label>
              <div className="flex gap-5 w-1/2 ">
                <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
                  time spent :{" "}
                  {timeTracking.timeSpent === 0
                    ? timeSpent
                    : timeTracking.timeSpent}
                  <input
                    type="number"
                    className="w-full border rounded p-2  text-gray-700 font-normal"
                    name={timeSpentValue.name}
                    onChange={(e) => {
                      timeSpentValue.onChange;
                      setTimeTracking({
                        ...timeTracking,
                        timeSpent: Number(e.target.value),
                      });
                    }}
                    onBlur={timeSpentValue.onBlur}
                    ref={timeSpentValue.ref}
                  />
                  {errors.timeSpent && (
                    <span className="text-red-500">
                      {errors.timeSpent.message}
                    </span>
                  )}
                </label>
                <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
                  time remaining :
                  {timeTracking.timeRemaining === 0
                    ? timeRemaining
                    : timeTracking.timeRemaining}
                  <input
                    type="number"
                    className="w-full border rounded p-2  text-gray-700 font-normal"
                    name={timeRemainingValue.name}
                    onChange={(e) => {
                      timeRemainingValue.onChange;
                      setTimeTracking({
                        ...timeTracking,
                        timeRemaining: Number(e.target.value),
                      });
                    }}
                    onBlur={timeRemainingValue.onBlur}
                    ref={timeRemainingValue.ref}
                  />
                  {errors.timeRemaining && (
                    <span className="text-red-500">
                      {errors.timeRemaining.message}
                    </span>
                  )}
                </label>
              </div>
            </div>
            <div className="flex gap-5 w-full mt-2">
              <label className="w-1/2 text-gray-700 text-sm font-bold flex-1 z-0">
                Description
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: "This field is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Editor
                      apiKey="w1t07959btha8whcoqneja1m0pxjy5k1p38pv95jt3ywz6l3"
                      initialValue={taskDetails?.description}
                      init={{
                        height: 200,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                      onEditorChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </label>
              <Comment taskId={taskDetails?.taskId} />
            </div>
            <button type="submit" className="bg-red-400 w-14">
              Edit
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

export default EditTask;
