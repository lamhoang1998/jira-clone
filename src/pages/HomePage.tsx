import { Link, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useAppSelector } from "../hooks";
import jiraHomepage from "assets/jira-homepage-logo.png";

function HomePage() {
  const userToken = useAppSelector((store) => store.userState.user?.token);

  const isSidebarCollapsed = useAppSelector(
    (store) => store.toggleState.isSidebarCollapsed,
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
        <>
          <header className="max-w-[1200px] mx-auto flex  items-center py-2">
            <img src={jiraHomepage} width={50} height={50} />
            <span className="inline-block text-3xl bold">JIRA</span>
          </header>
          <p className="text-center ">
            You haven't logged in yet, please
            <Link className="text-blue-500 hover:text-blue-700" to="/login">
              Login
            </Link>
          </p>
        </>
      )}
    </>
  );
}

export default HomePage;
