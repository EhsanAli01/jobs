import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobsData",
  initialState: {
    jobsArray: [],
    cardData: {},
    jobRequest: [],
    notifications: [],
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

    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { setJobsArray, setCardData, setJobRequests, setNotifications } =
  jobSlice.actions;

export const jobsReducer = jobSlice.reducer;
