import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    task: taskReducer,
  },
});