import { configureStore } from '@reduxjs/toolkit';
import { jobsReducer, cardDataReducer } from './slices/jobSlice.js';

const store = configureStore({
    reducer: {
        jobs: jobsReducer,
        cardData: cardDataReducer
    }
});

export default store;