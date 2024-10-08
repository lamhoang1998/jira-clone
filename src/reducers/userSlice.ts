import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  userName: string;
  token: string;
};

export type UserState = {
  user: User | null;
};

function getUserFromLocalStore(): User | null {
  const user = localStorage.getItem("user");
  if (!user) return null;

  return JSON.parse(user);
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export default userSlice.reducer;
