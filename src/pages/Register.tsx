import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { Card } from "antd";
import { customFetch } from "../services/baseApi";
import { type ReduxStore } from "../store";
import { setToastMessage } from "../reducers/toastSlice";
import { AxiosError } from "axios";

type FormError = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
};

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }): Promise<Response | FormError> => {
    const formData = await request.formData();
    console.log(formData);
    const data = Object.fromEntries(formData);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const phoneNumber = formData.get("phoneNumber");

    const errors: FormError = {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
    };

    try {
      if (
        typeof data.email !== "string" ||
        !(data.email as any).includes("@") ||
        typeof data.password !== "string" ||
        (data.password as any).length < 1 ||
        typeof data.name !== "string" ||
        (data.name as any).length < 1 ||
        typeof data.phoneNumber !== "string" ||
        (data.phoneNumber as any).length < 10
      ) {
        throw new Error();
      }
      const res = await customFetch.post("/api/Users/signup", data);
      console.log("register", res);
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
      console.log(error);
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

      if (typeof name !== "string" || name.length < 1) {
        errors.name = "Name must be included";
      }

      if (typeof phoneNumber !== "string" || phoneNumber.length < 10) {
        errors.phoneNumber = "please reenter your phone number";
      }

      return errors;
    }
  };

function Register() {
  const errors = useActionData() as FormError;
  return (
    <section className="h-screen grid place-items-center bg-blue-700">
      <Card
        title="Register"
        className="w-96 text-center  bg-blue-400 font-semibold"
      >
        <Form className="flex flex-col gap-3" method="post" noValidate>
          <label htmlFor="email" className="text-left bold">
            email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="border rounded w-full py-1 px-2 "
          />
          {errors?.email && (
            <span className="text-red-500 text-left">{errors?.email} </span>
          )}
          <label htmlFor="password" className="text-left bold">
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
          <label htmlFor="username" className="text-left bold">
            name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="border rounded w-full py-1 px-2 "
          />
          {errors?.name && (
            <span className="text-red-500 text-left">{errors?.name}</span>
          )}
          <label htmlFor="phone" className="text-left bold">
            phone number
          </label>

          <input
            id="phone"
            type="text"
            name="phoneNumber"
            className="border rounded w-full py-1 px-2 "
          />
          {errors?.phoneNumber && (
            <span className="text-red-500 text-left">
              {errors?.phoneNumber}
            </span>
          )}
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
