import { createSlice } from '@reduxjs/toolkit';

const renderSlice = createSlice({
    name: 'render',
    initialState: {
        value: 1
    },
    reducers: {
        reRender: (state) => {
            state.value = state.value + 1;
        }
    }
})

export const { reRender } = renderSlice.actions;

export const renderReducer = renderSlice.reducer;