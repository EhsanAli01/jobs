import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        value: []
    },
    reducers: {
        setJobsArray: (state, action) => {
            state.value = action.payload;
        }
    }
});

const jobCardSlice = createSlice({
    name: 'cardData',
    initialState: {
        value: {}
    },
    reducers: {
        setCardData: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setJobsArray } = jobSlice.actions;
export const { setCardData } = jobCardSlice.actions;

export const jobsReducer = jobSlice.reducer;
export const cardDataReducer = jobCardSlice.reducer;