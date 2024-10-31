import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProjectDetails } from "../reducers/detailsSlice";
import { LstTask } from "../reducers/detailsSlice";
import parse from "html-react-parser";
import {
  ArrowUpOutlined,
  BorderOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { setOpenEditTask } from "../reducers/popupSlice";
import {
  deleteTask,
  fetchStatus,
  fetchTaskDetail,
  updateStatus,
} from "../reducers/taskSlice";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

function ProjectDetails() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const details = useAppSelector((store) => store.detailsState.details);
  console.log("details", details);
  const loading = useAppSelector((store) => store.detailsState.loading);
  const error = useAppSelector((store) => store.detailsState.error);
  const status = useAppSelector((store) => store.taskState.status);
  console.log("status", status);

  // create the mapper for status id and name
  const statusMap = new Map();
  status.forEach((stt) => statusMap.set(stt.statusName, stt.statusId));

  const handleDragEnd = (result: DropResult) => {
    console.log("result", result);
    const statusId = statusMap.get(result.destination?.droppableId);
    console.log("sttId", statusId);
    const taskId = +result.draggableId;
    dispatch(
      updateStatus({
        taskId: taskId,
        statusId: +statusId,
        projectId: id as string,
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchProjectDetails(id as string));
    dispatch(fetchStatus());
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && !error && (
        <div className="p-8 min-h-full">
          <h3 className="text-3xl mb-3">{details?.projectName}</h3>
          {details?.description && (
            <p className="mb-3">{parse(details?.description)}</p>
          )}

          <div className="flex">
            <div className="relative mr-3">
              <input
                type="text"
                className="h-8 w-52 detail-search-bg border-solid border-2 rounded-md from-detail-border-bg"
              />
              <SearchOutlined className="absolute left-[2%] top-[17%] text-gray-600 text-2xl" />
            </div>
            <div className="ml-3 flex">
              {details?.members.map((member) => (
                <div className="ml-[-10px]" key={member.userId}>
                  <Avatar
                    src={member.avatar}
                    alt={member.avatar}
                    className=" border-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="my-5 flex flex-col h-full lg:flex-row">
            <DragDropContext onDragEnd={handleDragEnd}>
              {details?.lstTask.map((task, index) => (
                <Droppable key={index} droppableId={task.statusName}>
                  {(provided) => {
                    return (
                      <div className="mr-3 w-full h-full " key={index}>
                        <div className="p-5 bg-blue-500 text-amber-100 text-sm ">
                          {task.statusName}
                        </div>
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="h-full bg-gray-200 flex flex-col gap-3 p-3"
                        >
                          {task.lstTaskDeTail?.map((taskdetail, index) => (
                            <Draggable
                              key={taskdetail.taskId}
                              index={index}
                              draggableId={taskdetail.taskId.toString()}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  key={index}
                                  className="p-5  bg-white flex flex-col gap-1 "
                                  onClick={() => {
                                    dispatch(setOpenEditTask());
                                    dispatch(
                                      fetchTaskDetail(taskdetail.taskId),
                                    );
                                  }}
                                >
                                  <div className="flex justify-between">
                                    <span>{taskdetail.taskName}</span>
                                    <span>
                                      {taskdetail.priorityTask.priority}
                                    </span>
                                  </div>
                                  <p>{parse(taskdetail.description)}</p>
                                  <div className="flex justify-between">
                                    <div>
                                      <BorderOutlined />
                                      <ArrowUpOutlined />
                                    </div>
                                    <div>
                                      {taskdetail.assigness.map((assign) => (
                                        <Avatar src={assign.avatar} />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <Link
                                      to={`/task/${taskdetail.taskId}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      View more
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(
                                          deleteTask({
                                            taskId: taskdetail.taskId,
                                            projectId: details.id,
                                          }),
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </li>
                              )}
                              {/* <li
                                key={index}
                                className="p-5  bg-white flex flex-col gap-1 "
                                onClick={() => {
                                  dispatch(setOpenEditTask());
                                  dispatch(fetchTaskDetail(taskdetail.taskId));
                                }}
                              >
                                <div className="flex justify-between">
                                  <span>{taskdetail.taskName}</span>
                                  <span>
                                    {taskdetail.priorityTask.priority}
                                  </span>
                                </div>
                                <p>{parse(taskdetail.description)}</p>
                                <div className="flex justify-between">
                                  <div>
                                    <BorderOutlined />
                                    <ArrowUpOutlined />
                                  </div>
                                  <div>
                                    {taskdetail.assigness.map((assign) => (
                                      <Avatar src={assign.avatar} />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <Link
                                    to={`/task/${taskdetail.taskId}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    View more
                                  </Link>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        deleteTask({
                                          taskId: taskdetail.taskId,
                                          projectId: details.id,
                                        }),
                                      );
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li> */}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      </div>
                    );
                  }}
                  {/* (
                  <>
                    <div className="mr-3 w-full h-full " key={index}>
                      <div className="p-5 bg-blue-500 text-amber-100 text-sm ">
                        {task.statusName}
                      </div>
                      <ul className="h-full bg-gray-200 flex flex-col gap-3 p-3">
                        {task.lstTaskDeTail?.map((taskdetail, index) => (
                          <li
                            key={index}
                            className="p-5  bg-white flex flex-col gap-1 "
                            onClick={() => {
                              dispatch(setOpenEditTask());
                              dispatch(fetchTaskDetail(taskdetail.taskId));
                            }}
                          >
                            <div className="flex justify-between">
                              <span>{taskdetail.taskName}</span>
                              <span>{taskdetail.priorityTask.priority}</span>
                            </div>
                            <p>{parse(taskdetail.description)}</p>
                            <div className="flex justify-between">
                              <div>
                                <BorderOutlined />
                                <ArrowUpOutlined />
                              </div>
                              <div>
                                {taskdetail.assigness.map((assign) => (
                                  <Avatar src={assign.avatar} />
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <Link
                                to={`/task/${taskdetail.taskId}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                View more
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    deleteTask({
                                      taskId: taskdetail.taskId,
                                      projectId: details.id,
                                    }),
                                  );
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                  ) */}
                </Droppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      )}
      {error && <ErrorMessage message={error.errorMessage as string} />}
    </>
  );
}

export default ProjectDetails;

//  {
//    details?.lstTask.map((task, index) => (
//      <div className="mr-3 w-full h-full " key={index}>
//        <div className="p-5 bg-blue-500 text-amber-100 text-sm ">
//          {task.statusName}
//        </div>
//        <ul className="h-full bg-gray-200 flex flex-col gap-3 p-3">
//          {task.lstTaskDeTail?.map((taskdetail, index) => (
//            <li
//              key={index}
//              className="p-5  bg-white flex flex-col gap-1 "
//              onClick={() => {
//                dispatch(setOpenEditTask());
//                dispatch(fetchTaskDetail(taskdetail.taskId));
//              }}
//            >
//              <div className="flex justify-between">
//                <span>{taskdetail.taskName}</span>
//                <span>{taskdetail.priorityTask.priority}</span>
//              </div>
//              <p>{parse(taskdetail.description)}</p>
//              <div className="flex justify-between">
//                <div>
//                  <BorderOutlined />
//                  <ArrowUpOutlined />
//                </div>
//                <div>
//                  {taskdetail.assigness.map((assign) => (
//                    <Avatar src={assign.avatar} />
//                  ))}
//                </div>
//              </div>
//              <div className="flex justify-between">
//                <Link
//                  to={`/task/${taskdetail.taskId}`}
//                  onClick={(e) => {
//                    e.stopPropagation();
//                  }}
//                >
//                  View more
//                </Link>
//                <button
//                  onClick={(e) => {
//                    e.stopPropagation();
//                    dispatch(
//                      deleteTask({
//                        taskId: taskdetail.taskId,
//                        projectId: details.id,
//                      }),
//                    );
//                  }}
//                >
//                  Delete
//                </button>
//              </div>
//            </li>
//          ))}
//        </ul>
//      </div>
//    ));
//  }
