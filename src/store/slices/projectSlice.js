import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;