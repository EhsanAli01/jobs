import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobsData",
  initialState: {
    jobsArray: [],
    cardData: {},
    jobRequest: [],
  },
  reducers: {
    setJobsArray: (state, action) => {
      state.jobsArray = action.payload;
    },

    setCardData: (state, action) => {
      state.cardData = action.payload;
    },

    setJobRequests: (state, action) => {
      state.jobRequest = action.payload;
    },
  },
});

export const { setJobsArray, setCardData, setJobRequests } = jobSlice.actions;

export const jobsReducer = jobSlice.reducer;
