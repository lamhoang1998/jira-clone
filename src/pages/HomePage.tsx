import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useAppSelector } from "../hooks";

function HomePage() {
  const isSidebarCollapsed = useAppSelector(
    (store) => store.globalState.isSidebarCollapsed,
  );
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <SideBar />
      <main
        className={`flex w-full flex-col bg-gray-50 ${isSidebarCollapsed ? "" : "md:pl-64"}`}
      >
        <NavBar />
        <Outlet />
      </main>
    </div>
  );
}

export default HomePage;
