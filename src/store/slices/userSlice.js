import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateUserRole: (state, action) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, updateUserRole } = userSlice.actions;
export default userSlice.reducer;