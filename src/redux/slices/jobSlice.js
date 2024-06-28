import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobsData",
  initialState: {
    jobs: [],
    cardData: {},
    jobRequest: [],
  },
  reducers: {
    setJobsArray: (state, action) => {
      state.value = action.payload;
    },

    setCardData: (state, action) => {
      state.value = action.payload;
    },

    setJobRequests: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setJobsArray } = jobSlice.actions;
export const { setCardData } = jobSlice.actions;
export const { setJobRequests } = jobSlice.actions;

export const jobsReducer = jobSlice.reducer;
