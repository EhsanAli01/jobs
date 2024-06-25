import { configureStore } from '@reduxjs/toolkit';
import { jobsReducer, cardDataReducer, jobRequestReducer } from './slices/jobSlice.js';
import { renderReducer } from './slices/renderSlice.js';

const store = configureStore({
    reducer: {
        jobs: jobsReducer,
        cardData: cardDataReducer,
        jobRequest: jobRequestReducer,
        render: renderReducer
    }
});

export default store;