import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobsData",
  initialState: {
    jobsArray: [],
    cardData: {},
    jobRequest: [],
    notifications: [],
    reviews: [],
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

    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
  },
});

export const {
  setJobsArray,
  setCardData,
  setJobRequests,
  setNotifications,
  setReviews,
} = jobSlice.actions;

export const jobsReducer = jobSlice.reducer;
