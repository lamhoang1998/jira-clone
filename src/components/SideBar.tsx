import {
  CloseOutlined,
  HomeFilled,
  PoweroffOutlined,
  TeamOutlined,
  ToolFilled,
} from "@ant-design/icons";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setIsSidebarCollapsed } from "../reducers/toggleSlice";
import { logoutUser } from "../reducers/userSlice";

function SideBar() {
  const isSidebarCollapsed = useAppSelector(
    (store) => store.toggleState.isSidebarCollapsed,
  );
  console.log("isSidebarCollapsed", isSidebarCollapsed);

  const dispatch = useAppDispatch();

  const sidebarClassName = `fixed flex flex-col h-[100%] justify-between shadow-xl translation-all duration-300 h-full z-40 overflow-y-auto bg-white w-64 md:w-64  ${isSidebarCollapsed ? `w-0 hidden` : ""}`;

  const activeClass =
    "w-ful relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-blue-700 bg-blue-500 text-gray-200 p-2";

  const normalClass =
    "w-full relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 p-2";

  useEffect(() => {
    window.addEventListener("resize", () => {});
  }, []);
  return (
    <div className={sidebarClassName}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3">
          <div className="text-xl font-bold text-gray-800">JIRA</div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <CloseOutlined />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4">
          <img
            src="/public/JSW sign-responsive.png"
            alt="jira-logo"
            width={40}
            height={40}
          />
          <h3 className="text-md font-bold tracking-wide">
            PROJECTS MANAGEMENT
          </h3>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <HomeFilled /> Project Management
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <ToolFilled /> Create
          </NavLink>
          <NavLink
            to="/user"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <TeamOutlined /> User
          </NavLink>
        </nav>
        <div className="mt-auto pb-3 pt-3 flex gap-1 items-center justify-center hover:bg-blue-500">
          <PoweroffOutlined />
          <button
            className=""
            onClick={() => {
              dispatch(logoutUser());
            }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
