import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { fetchProject } from "../reducers/projectSlice";
import { useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Space, Table, Tag } from "antd";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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

interface ProjectType {
  id: number;
  projectName: string;
  description: string;
  categoryName: string;
  creator: { id: number; name: string };
}

function ProjectManagement() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((store) => store.projectState.loading);
  const error = useAppSelector((store) => store.projectState.error);
  const projects = useAppSelector((store) => store.projectState.contents);

  console.log(projects);

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

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };

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
      title: "Description",
      dataIndex: "description",
      key: "description",
      // filters: [
      //   { text: "London", value: "London" },
      //   { text: "New York", value: "New York" },
      // ],
      // filteredValue: filteredInfo.address || null,
      // onFilter: (value, record) => record.address.includes(value as string),
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      // ellipsis: true,
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
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Space size="middle">
          <a>
            <EditOutlined />
          </a>
          <a>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  useEffect(function () {
    dispatch(fetchProject());
  }, []);
  return (
    <>
      {loading && <Loader />}
      {!loading && !error && (
        <>
          <Space style={{ marginBottom: 16 }} className="ml-3 sm:ml-64 md:ml-1">
            <Button onClick={setAgeSort}>Sort age</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
          </Space>
          <Table<ProjectType>
            columns={columns}
            dataSource={projects}
            onChange={handleChange}
          />
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

export default ProjectManagement;
