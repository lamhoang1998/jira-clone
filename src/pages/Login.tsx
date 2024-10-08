function Login() {
  return (
    <div className="bg-black h-screen place-items-center">
      <div className=" flex-col gap-5 bg-blue-900 w-96 mx-auto p-6 pt-0">
        <h3 className="text-center">Login</h3>
        <form className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="mb-3" />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="mb-3"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
