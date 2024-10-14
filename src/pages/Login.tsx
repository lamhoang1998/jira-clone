import { Card } from "antd";
import { ActionFunction, Form, Link, redirect } from "react-router-dom";
import { ReduxStore } from "../store";
import { customFetch } from "../services/baseApi";
import { loginUser } from "../reducers/userSlice";
import { setToastMessage } from "../reducers/toastSlice";
import { AxiosError } from "axios";

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }): Promise<Response | null> => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      store.dispatch(
        setToastMessage({
          toastState: true,
          toastMessage: "Đăng nhập thành công!",
          toastStatus: "SUCCESS",
        }),
      );
      const res = await customFetch.post("/api/Users/signin", data);
      console.log(res);
      store.dispatch(
        loginUser({
          userName: res.data.content.email,
          token: res.data.content.accessToken,
        }),
      );
      return redirect("/");
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Registration Failed";
      store.dispatch(
        setToastMessage({
          toastState: true,
          toastMessage: errorMsg,
          toastStatus: "ERROR",
        }),
      );
      return null;
    }
  };

function Login() {
  return (
    <section className="h-screen grid place-items-center ">
      <Card title="Login" className="w-96 text-center">
        <Form className="flex flex-col gap-3" method="post">
          <label htmlFor="email" className="text-left">
            email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="border rounded w-full py-1 px-2 "
          />
          <label htmlFor="password" className="text-left">
            password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="border rounded w-full py-1 px-2 "
          />
          <button type="submit">Login</button>
          <p>
            Not a member yet? <Link to="/register">Register</Link>
          </p>
        </Form>
      </Card>
    </section>
  );
}

export default Login;
