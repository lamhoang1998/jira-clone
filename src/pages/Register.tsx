import { ActionFunction, Form, Link, redirect } from "react-router-dom";
import { Card } from "antd";
import { customFetch } from "../services/baseApi";
import { type ReduxStore } from "../store";
import { setToastMessage } from "../reducers/toastSlice";
import { AxiosError } from "axios";

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }): Promise<Response | null> => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
      const res = await customFetch.post("/api/Users/signup", data);
      const messageSuccess = res.data.message;
      store.dispatch(
        setToastMessage({
          toastState: true,
          toastMessage: messageSuccess,
          toastStatus: "SUCCESS",
        }),
      );
      return redirect("/login");
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Registration Failed";
      console.log(errorMsg);
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

function Register() {
  return (
    <section className="h-screen grid place-items-center ">
      <Card title="Register" className="w-96 text-center">
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
          <label htmlFor="username" className="text-left">
            name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="border rounded w-full py-1 px-2 "
          />

          <label htmlFor="phone" className="text-left">
            phone number
          </label>
          <input
            id="phone"
            type="text"
            name="phoneNumber"
            className="border rounded w-full py-1 px-2 "
          />
          <button type="submit">Register</button>
          <p>
            Already member? <Link to="/login">Login</Link>
          </p>
        </Form>
      </Card>
    </section>
  );
}

export default Register;
