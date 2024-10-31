import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProjectManagement from "./pages/ProjectManagement";
import Create from "./pages/Create";
import User from "./pages/User";
import ProjectDetails from "./pages/ProjectDetails";
import { action as registerUser } from "./pages/Register";
import { action as loginAction } from "./pages/Login";

import { store } from "./store";
import TaskDetails from "./pages/TaskDetails";

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
        { path: "task/:id", element: <TaskDetails /> },
        { path: "user", element: <User /> },
      ],
    },
    { path: "/login", element: <Login />, action: loginAction(store) },
    {
      path: "/register",
      element: <Register />,
      action: registerUser(store),
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
