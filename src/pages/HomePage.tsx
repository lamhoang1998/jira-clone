import { Link, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useAppSelector } from "../hooks";

function HomePage() {
  const userToken = useAppSelector((store) => store.userState.user?.token);

  const isSidebarCollapsed = useAppSelector(
    (store) => store.globalState.isSidebarCollapsed,
  );
  return (
    <>
      {userToken ? (
        <div className="flex min-h-full w-full  bg-gray-50 text-gray-900">
          <SideBar />
          <main
            className={`flex w-full flex-col min-h-[100vh] flex-1 bg-gray-50 ${isSidebarCollapsed ? "" : "md:pl-64"}`}
          >
            <NavBar />
            <Outlet />
          </main>
        </div>
      ) : (
        <p>
          You haven't logged in yet, please{" "}
          <Link className="text-blue-200 hover:text-blue-700" to="/login">
            Login
          </Link>
        </p>
      )}
    </>
  );
}

export default HomePage;
