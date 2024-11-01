import { useAppDispatch, useAppSelector } from "../hooks";
import { MenuOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { setIsSidebarCollapsed } from "../reducers/toggleSlice";
import { setOpenCreateTask } from "../reducers/popupSlice";
import { Avatar, Popover } from "antd";

function NavBar() {
  const isSidebarCollapsed = useAppSelector(
    (store) => store.toggleState.isSidebarCollapsed,
  );

  const userName = useAppSelector((store) => store.userState.userName);
  console.log("userName", userName);

  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3">
      {!isSidebarCollapsed ? null : (
        <button
          onClick={() => {
            dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
          }}
        >
          <MenuOutlined className="h-8 w-8" />
        </button>
      )}
      <div className=" cursor-pointer">
        <Popover placement="topLeft" title="create tasks">
          <button
            onClick={() => {
              dispatch(setOpenCreateTask());
            }}
          >
            <PlusOutlined className="w-8 h-8" />
          </button>
        </Popover>
        <SearchOutlined className="w-8 h-8" />
      </div>
      <h2 className="ml-auto flex gap-2 items-center">
        <Avatar>{userName.slice(0, 1).toUpperCase()}</Avatar>
        {userName.toUpperCase()}
      </h2>
    </div>
  );
}

export default NavBar;
