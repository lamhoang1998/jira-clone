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
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { setOpenModal } from "../reducers/popupSlice";
import {
  addMember,
  fetchMembers,
  removeMember,
} from "../reducers/membersSlice";
import { current } from "@reduxjs/toolkit";
import { NavLink } from "react-router-dom";

type OnChange = NonNullable<TableProps<ProjectType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

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
  const members = useAppSelector((store) => store.membersState.members);

  const [member, setMember] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  const data: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
    },
  ];

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("pagination", pagination);
    setPage(pagination.current as number);
  };

  console.log(page);

  const columns: TableColumnsType<ProjectType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      // filters: [
      //   { text: "Joe", value: "Joe" },
      //   { text: "Jim", value: "Jim" },
      // ],
      // filteredValue: filteredInfo.name || null,
      // onFilter: (value, record) => record.name.includes(value as string),
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      // sorter: (a, b) => a.age - b.age,
      // sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      // ellipsis: true,
      render: (text, record, index) => {
        return (
          <NavLink to={`project/${record.id}`}>{record.projectName}</NavLink>
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
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",

    // },
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
      dataIndex: "creator",
      key: "creator",
      render: (text, record, index) => {
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
      title: "member",
      dataIndex: "member",
      key: "member",
      render: (text, record, index) => {
        console.log(record.members);
        return (
          <div>
            {record.members?.slice(0.3).map((member) => (
              <Popover
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
      render: (text, record, index) => (
        <Space size="middle">
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
      ),
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
