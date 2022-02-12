import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
    },
    reducers: {
        setLoading(state, {payload}) {
            state.isLoading = payload.isLoading;
        }
    }
});

export const {setLoading} = appSlice.actions;
export default appSlice.reducer;

