import { configureStore } from "@reduxjs/toolkit";
import { jobsReducer } from "./slices/jobSlice.js";
import { renderReducer } from "./slices/renderSlice.js";

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    render: renderReducer,
  },
});

export default store;
