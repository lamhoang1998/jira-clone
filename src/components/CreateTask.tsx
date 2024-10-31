import { Button, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCloseCreateTask } from "../reducers/popupSlice";
import { useEffect, useState } from "react";
import {
  createTask,
  fetchPriority,
  fetchStatus,
  fetchTaskType,
} from "../reducers/taskSlice";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { fetchMembers } from "../reducers/membersSlice";
import { Editor } from "@tinymce/tinymce-react";
import { fetchProjectDetails } from "../reducers/detailsSlice";
import { fetchProject } from "../reducers/projectSlice";

function CreateTask() {
  const dispatch = useAppDispatch();

  //data from the store
  const allProject = useAppSelector((store) => store.projectState.contents);
  console.log(allProject);

  const openCreateTask = useAppSelector(
    (store) => store.popupState.openCreateTask,
  );

  const taskPriority = useAppSelector((store) => store.taskState.priority);
  const taskType = useAppSelector((store) => store.taskState.taskType);
  const members = useAppSelector((store) => store.membersState.members);
  const status = useAppSelector((store) => store.taskState.status);
  // const [member, setMember] = useState<string>("");

  const [timeTracking, setTimeTracking] = useState<{
    timeSpent: number;
    timeRemaining: number;
  }>({
    timeSpent: 0,
    timeRemaining: 0,
  });

  const projectOption: { label: string; value: string }[] | [] = allProject
    ? allProject.map((project) => ({
        label: project.projectName,
        value: project.projectName,
      }))
    : [];

  useEffect(function () {
    dispatch(fetchProject());
    dispatch(fetchTaskType());
    dispatch(fetchPriority());
    dispatch(fetchStatus());
  }, []);

  useEffect(function () {
    dispatch(fetchMembers(""));
  }, []);

  type FormType = {
    project: { label: string; value: string };
    taskName: string;
    status: string;
    priority: string;
    taskType: string;
    member: { label: string; value: string }[];
    originalEstimate: number;
    timeSpent: number;
    timeRemaining: number;
    description: string;
  };

  const formDetails = useForm<FormType>();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    control,
    getValues,
    watch,
  } = formDetails;

  const projectName = watch("project");

  const timeSpent = register("timeSpent", {
    required: "This field is required",
  });

  const timeRemaining = register("timeRemaining", {
    required: "This fiedl is required",
  });

  //mapper
  const projectMap = new Map();

  const membersMap = new Map();

  const priorityMap = new Map();

  const typeMap = new Map();

  const statusMap = new Map();

  const IdMemberMap = new Map();

  allProject.forEach((project) =>
    projectMap.set(project.projectName, project.id),
  );

  allProject.forEach((project) => IdMemberMap.set(project.id, project.members));

  members.forEach((member) => membersMap.set(member.name, member.userId));

  taskPriority.forEach((task) =>
    priorityMap.set(task.priority, task.priorityId),
  );

  taskType.forEach((type) => typeMap.set(type.taskType, type.id));

  status.forEach((stt) => statusMap.set(stt.statusName, stt.statusId));

  const projectId = projectMap.get(projectName?.value);

  const projectMembers: { userId: number; name: string; avatar: string }[] =
    IdMemberMap.get(projectId);

  const selectOption: { label: string; value: string }[] | [] = projectMembers
    ? projectMembers?.map((member) => {
        return {
          label: member.name,
          value: member.name,
        };
      })
    : [];

  console.log("selectoption", selectOption);

  //submit

  type dataSubmit = {
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

  const onSubmit = handleSubmit((data) => {
    const listUSerAsign = data.member.map((mem) => membersMap.get(mem.label));

    const projectId = projectMap.get(data.project.label);

    const priorityId = priorityMap.get(data.priority);

    const typeId = typeMap.get(data.taskType);

    const statusId = statusMap.get(data.status);

    const dataSubmit: dataSubmit = {
      listUserAsign: listUSerAsign,
      taskName: data.taskName,
      description: data.description,
      statusId: +statusId,
      originalEstimate: +data.originalEstimate,
      timeTrackingSpent: +data.timeSpent,
      timeTrackingRemaining: +data.timeRemaining,
      projectId: projectId,
      typeId: typeId,
      priorityId: priorityId,
    };
    dispatch(createTask(dataSubmit));
  });

  return (
    <>
      <Modal
        title={<h2 className="text-3xl font-bold">Create tasks</h2>}
        open={openCreateTask}
        width={700}
        onCancel={() => {
          dispatch(setCloseCreateTask());
        }}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <label className="text-gray-700 text-sm font-bold flex-1 ">
            Project
            <Controller
              control={control}
              name="project"
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  options={projectOption}
                  isMulti={false}
                />
              )}
            />
            {errors.project && (
              <span className="text-red-500">{errors.project.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1 ">
            Task name
            <input
              type="text"
              className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
              {...register("taskName", { required: "This field is required" })}
            />
            {errors.taskName && (
              <span className="text-red-500">{errors.taskName.message}</span>
            )}
          </label>
          <label className=" text-gray-700 text-sm font-bold flex-1">
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
          <div className="flex gap-5  w-full mt-2">
            <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
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
                <span className="text-red-500">{errors.priority.message}</span>
              )}
            </label>
            <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
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
                <span className="text-red-500">{errors.taskType.message}</span>
              )}
            </label>
          </div>
          <div className="flex gap-5 w-full mt-2">
            <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
              Member
              <Controller
                control={control}
                name="member"
                rules={{ required: "This field is required" }}
                // render={({ field }) => (
                //   <Select {...field} options={selectOption} isMulti={true} />
                // )}
                render={({ field }) => {
                  return (
                    <Select {...field} options={selectOption} isMulti={true} />
                  );
                }}
              />
              {errors.member && (
                <span className="text-red-500">{errors.member.message}</span>
              )}
            </label>
            <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
              Time tracking
              <input
                type="range"
                min={0}
                max={timeTracking.timeSpent + timeTracking.timeRemaining}
                value={timeTracking.timeSpent}
                defaultValue={30}
                className="border rounded w-full p-2 mt-2 text-gray-700 font-normal"
              />
            </label>
          </div>
          <div className="flex gap-5 w-full mt-2">
            <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
              Original Estimate
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
            <div className="flex gap-5 w-1/2 ">
              <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
                time spent : {timeTracking.timeSpent}h
                <input
                  type="number"
                  className="w-full border rounded p-2  text-gray-700 font-normal"
                  name={timeSpent.name}
                  onChange={(e) => {
                    timeSpent.onChange;
                    setTimeTracking({
                      ...timeTracking,
                      timeSpent: Number(e.target.value),
                    });
                  }}
                  onBlur={timeSpent.onBlur}
                  ref={timeSpent.ref}
                />
                {errors.timeSpent && (
                  <span className="text-red-500">
                    {errors.timeSpent.message}
                  </span>
                )}
              </label>
              <label className="w-1/2 text-gray-700 text-sm font-bold flex-1">
                time remaining : {timeTracking.timeRemaining}h
                <input
                  type="number"
                  className="w-full border rounded p-2  text-gray-700 font-normal"
                  name={timeRemaining.name}
                  onChange={(e) => {
                    timeRemaining.onChange;
                    setTimeTracking({
                      ...timeTracking,
                      timeRemaining: Number(e.target.value),
                    });
                  }}
                  onBlur={timeRemaining.onBlur}
                  ref={timeRemaining.ref}
                />
                {errors.timeRemaining && (
                  <span className="text-red-500">
                    {errors.timeRemaining.message}
                  </span>
                )}
              </label>
            </div>
          </div>
          <label className="text-gray-700 text-sm font-bold flex-1 z-0">
            Description
            <Controller
              control={control}
              name="description"
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Editor
                  apiKey="w1t07959btha8whcoqneja1m0pxjy5k1p38pv95jt3ywz6l3"
                  initialValue=""
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
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </label>
          <button type="submit">submit</button>
        </form>
      </Modal>
    </>
  );
}

export default CreateTask;
