import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    Id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@synerghub.com",
    role: "Administrator",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    job_title: "Chief Technology Officer",
    department: "Technology",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateUserRole: (state, action) => {
      state.currentUser.role = action.payload;
    },
  },
});

export const { setCurrentUser, updateUserRole } = userSlice.actions;
export default userSlice.reducer;