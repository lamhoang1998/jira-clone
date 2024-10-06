import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProjectManagement from "./pages/ProjectManagement";
import Create from "./pages/Create";
import User from "./pages/User";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children: [
        {
          index: true,
          element: <ProjectManagement />,
        },
        {
          path: "project/:id",
          element: <ProjectDetails />,
        },
        {
          path: "create",
          element: <Create />,
        },
        { path: "user", element: <User /> },
      ],
    },
    { path: "/login", element: <Login /> },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
