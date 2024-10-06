import { useAppDispatch, useAppSelector } from "../hooks";
import { MenuOutlined } from "@ant-design/icons";
import { setIsSidebarCollapsed } from "../reducers/globalSlice";

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
      NavBar
    </div>
  );
}

export default NavBar;
