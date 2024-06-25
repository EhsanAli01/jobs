import { configureStore } from '@reduxjs/toolkit';
import { jobsReducer, cardDataReducer, jobRequestReducer } from './slices/jobSlice.js';

const store = configureStore({
    reducer: {
        jobs: jobsReducer,
        cardData: cardDataReducer,
        jobRequest: jobRequestReducer
    }
});

export default store;