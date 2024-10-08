import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProjectManagement from "./pages/ProjectManagement";
import Create from "./pages/Create";
import User from "./pages/User";
import ProjectDetails from "./pages/ProjectDetails";
import { action as registerUser } from "./pages/Register";
import { useAppSelector, useAppDispatch } from "./hooks";
import Toast from "./components/Toast";
import { setToastState } from "./reducers/toastSlice";
import { store } from "./store";

function App() {
  const toast = useAppSelector((store) => store.toastState.toast);
  const dispatch = useAppDispatch();

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
      action: registerUser(store),
    },
  ]);
  return (
    <>
      {toast.toastState && (
        <Toast
          message={toast.toastMessage}
          type={toast.toastStatus}
          onClose={() => {
            dispatch(setToastState());
          }}
        />
      )}
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
