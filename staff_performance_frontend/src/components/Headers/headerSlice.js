import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {errorAlert} from "../../helper/alerts";
import { getSummary } from "./headerService";

export const fetchSummary = createAsyncThunk(
    'projects/fetchSummary',
    async () => {
        let result = {};
        await getSummary()
        .then(response => {
                result =  { summary: response.data.data};
            }
        );
        return result;
    }
)

const initialState = {
    summary: {
        count_project: 'N/A', count_employee: 'N/A', count_ongoing_project: 'N/A', count_ongoing_task: 'N/A'
    },
};

const headerSlice = createSlice({
    initialState: initialState,
    name: 'header',
    extraReducers: {
        [fetchSummary.fulfilled]: (state, action) => {
            state.summary = action.payload.summary;
            state.is_loading = false;
        },
    }
});

export const {setSummary} = headerSlice.actions;
export default headerSlice.reducer;
