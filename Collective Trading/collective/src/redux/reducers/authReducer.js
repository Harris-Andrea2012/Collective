import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false,
    user: null,
  },
  reducers: {
    LOG_IN: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    LOG_OUT: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
  },
});
export const { LOG_IN, LOG_OUT } = authSlice.actions;

export default authSlice.reducer;
