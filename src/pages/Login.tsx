import { Card } from "antd";
import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { ReduxStore } from "../store";
import { customFetch } from "../services/baseApi";
import { loginUser } from "../reducers/userSlice";
import { setToastMessage } from "../reducers/toastSlice";
import { AxiosError } from "axios";

type FormError = { email: string; password: string };

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }): Promise<Response | FormError> => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const data = Object.fromEntries(formData);
    console.log(data);

    if (data.email === "" && data.password === "") {
      store.dispatch(
        setToastMessage({
          toastState: true,
          toastMessage: "must have email and password",
          toastStatus: "ERROR",
        }),
      );
      return { email: "", password: "" };
    }

    const errors: { email: string; password: string } = {
      email: "",
      password: "",
    };

    try {
      const res = await customFetch.post("/api/Users/signin", data);
      store.dispatch(
        setToastMessage({
          toastState: true,
          toastMessage: "Đăng nhập thành công!",
          toastStatus: "SUCCESS",
        }),
      );
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

      if (typeof email !== "string" || !email.includes("@")) {
        errors.email = "That doesn't look like an email address";
      }

      if (typeof password !== "string" || password.length < 1) {
        errors.password = "Password must be included";
      }

      return errors as FormError;
    }
  };

function Login() {
  const errors = useActionData() as FormError;
  return (
    <section className="h-screen grid place-items-center ">
      <Card title="Login" className="w-96 text-center">
        <Form className="flex flex-col gap-3" method="post" noValidate>
          <label htmlFor="email" className="text-left">
            email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="border rounded w-full py-1 px-2 "
          />
          {errors?.email === "" && (
            <span className="text-red-500 text-left">
              please enter your email
            </span>
          )}
          {errors?.email && (
            <span className="text-red-500 text-left">{errors?.email}</span>
          )}
          <label htmlFor="password" className="text-left">
            password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="border rounded w-full py-1 px-2 "
          />

          {errors?.password && (
            <span className="text-red-500 text-left">{errors?.password}</span>
          )}
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
