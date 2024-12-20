import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import {
  deleteProject,
  fetchProject,
  fetchProjectCategory,
  getProjectDetails,
} from "../reducers/projectSlice";
import type { TableColumnsType, TableProps } from "antd";
import { Space, Table, Tag, Avatar, Popover, Button, AutoComplete } from "antd";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { setOpenModal } from "../reducers/popupSlice";
import {
  addMember,
  fetchMembers,
  removeMember,
} from "../reducers/membersSlice";
import { NavLink } from "react-router-dom";

type OnChange = NonNullable<TableProps<ProjectType>["onChange"]>;

type Members = { userId: number; name: string; avatar: string };

interface ProjectType {
  id: number;
  projectName: string;
  description: string;
  categoryName: string;
  creator: { id: number; name: string };
  members: Members[];
}

function ProjectManagement() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((store) => store.projectState.loading);
  const error = useAppSelector((store) => store.projectState.error);
  const projects = useAppSelector((store) => store.projectState.contents);
  console.log("projects", projects);
  const members = useAppSelector((store) => store.membersState.members);
  console.log("members", members);

  const [member, setMember] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  const handleChange: OnChange = (pagination) => {
    console.log("pagination", pagination);
    setPage(pagination.current as number);
  };

  console.log(page);

  const columns: TableColumnsType<ProjectType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",

      render: (text, record, index) => {
        return (
          <NavLink key={index} to={`project/${record.id}`}>
            {text}
          </NavLink>
        );
      },
      sorter: (item2, item1) => {
        let projectName1 = item1.projectName?.trim().toLowerCase();
        let projectName2 = item2.projectName?.trim().toLowerCase();
        if (projectName2 < projectName1) {
          return -1;
        }
        return 1;
      },
    },

    {
      title: "category",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (item2, item1) => {
        let categoryName1 = item1.categoryName?.trim().toLowerCase();
        let categoryName2 = item2.categoryName?.trim().toLowerCase();
        if (categoryName2 < categoryName1) {
          return -1;
        }
        return 1;
      },
    },
    {
      title: "creator",
      key: "creator",
      render: (record) => {
        return <Tag color="blue">{record.creator?.name}</Tag>;
      },
      sorter: (item2, item1) => {
        let creator1 = item1.creator?.name.trim().toLowerCase();
        let creator2 = item2.creator?.name.trim().toLowerCase();
        if (creator2 < creator1) {
          return -1;
        }
        return 1;
      },
    },

    {
      title: "members",
      key: "members",
      render: (record: ProjectType) => {
        console.log("members", record);

        return (
          <div>
            {record.members.slice(0.3).map((member, index) => (
              <Popover
                key={index}
                placement="top"
                title="members"
                content={() => {
                  return (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th>Id</th>
                          <th>Avatar</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.members?.map((member) => (
                          <tr key={member.userId}>
                            <td>{member.userId}</td>
                            <td>
                              <img
                                src={member.avatar}
                                className="w-[20px] h-[20px]"
                              />
                            </td>
                            <td>{member.name}</td>
                            <td>
                              <button
                                className="bg-orange-600 p-2 rounded-sm text-gray-200"
                                onClick={() =>
                                  dispatch(
                                    removeMember({
                                      projectId: record.id,
                                      userId: member.userId,
                                    }),
                                  )
                                }
                              >
                                delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }}
              >
                <Avatar
                  key={member.userId}
                  src={member.avatar}
                  className="bg-orange-500 text-orange-500 ml-[-8px]"
                />
              </Popover>
            ))}
            {record.members?.length > 3 ? (
              <Avatar className="ml-[-8px]">...</Avatar>
            ) : (
              ""
            )}
            <Popover
              placement="topLeft"
              title="add members"
              content={() => (
                <div>
                  <AutoComplete
                    className="w-full"
                    value={member}
                    onChange={(text) => {
                      setMember(text);
                    }}
                    options={members?.map((member) => {
                      return { label: member.name, value: member.userId };
                    })}
                    onSelect={(value, option) => {
                      console.log("value", value);
                      setMember(option.label);
                      console.log(record.id, option.value);
                      dispatch(
                        addMember({
                          projectId: record.id,
                          userId: option.value,
                        }),
                      );
                    }}
                    onSearch={(value: string) => {
                      dispatch(fetchMembers(value));
                    }}
                  />
                </div>
              )}
            >
              <Button>+</Button>
            </Popover>
          </div>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        console.log(text);
        return (
          <Space size="middle" key={index}>
            <button
              className="hover:text-blue-400"
              onClick={() => {
                console.log(record);
                const { categoryName, description, id, projectName } = record;
                const projectDetails: {
                  id: number;
                  projectName: string;
                  categoryName: string;
                  description: string;
                } = { id, projectName, categoryName, description };
                dispatch(setOpenModal());
                dispatch(getProjectDetails(projectDetails));
              }}
            >
              <EditOutlined />
            </button>
            <button
              className="hover:text-blue-400"
              onClick={() => {
                dispatch(deleteProject(record.id));
              }}
            >
              <DeleteOutlined />
            </button>
          </Space>
        );
      },
    },
  ];

  useEffect(function () {
    dispatch(fetchProject());
  }, []);

  useEffect(function () {
    dispatch(fetchProjectCategory());
  }, []);
  return (
    <>
      {loading && <Loader />}
      {!loading && !error && (
        <>
          <Table<ProjectType>
            columns={columns}
            dataSource={projects}
            onChange={handleChange}
            pagination={{ current: page }}
          />
        </>
      )}
      {error && <ErrorMessage message={error.errorMessage} />}
    </>
  );
}

export default ProjectManagement;
