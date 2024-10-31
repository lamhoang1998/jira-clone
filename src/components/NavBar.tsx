import { useAppDispatch, useAppSelector } from "../hooks";
import { MenuOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { setIsSidebarCollapsed } from "../reducers/globalSlice";
import { setOpenCreateTask } from "../reducers/popupSlice";

function NavBar() {
  const isSidebarCollapsed = useAppSelector(
    (store) => store.globalState.isSidebarCollapsed,
  );

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
        <button
          onClick={() => {
            dispatch(setOpenCreateTask());
          }}
        >
          <PlusOutlined className="w-8 h-8" />
        </button>
        <SearchOutlined className="w-8 h-8" />
      </div>
      <h2 className="ml-auto">Navbar</h2>
    </div>
  );
}

export default NavBar;
