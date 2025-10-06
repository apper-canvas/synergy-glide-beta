import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTask: null,
  filterStatus: "all",
  filterPriority: "all",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },
  },
});

export const { setSelectedTask, setFilterStatus, setFilterPriority } = taskSlice.actions;
export default taskSlice.reducer;