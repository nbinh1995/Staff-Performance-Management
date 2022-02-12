import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getGroupEffort, getProjectEffort} from "./reportService";

export const fetchProjectEffort = createAsyncThunk(
    'reports/fetchProjectEffort',
    async (props) => {
        return await getProjectEffort(props.from, props.to)
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    });

export const fetchGroupEffort = createAsyncThunk(
    'reports/fetchGroupEffort',
    async (props) => {
        return await getGroupEffort({group: props.group, from: props.from, to: props.to})
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    });

const initialState = {project_effort: [], backend_effort: [], frontend_effort: [], active_tab: 0, is_loading: false};
const reportSlice = createSlice({
    name: 'reports',
    initialState: initialState,
    reducers: {
        setActiveTab(state, action) {
            state.active_tab = action.payload.active_tab;
        },
    },
    extraReducers: {
        [fetchProjectEffort.fulfilled]: (state, action) => {
            state.project_effort = action.payload.data;
        },
        [fetchGroupEffort.fulfilled]: (state, action) => {
            if(action.payload.group === 'frontend'){
                state.frontend_effort = action.payload.data;
            } else {
                state.backend_effort = action.payload.data;
            }
        },
    },
});

export const {
    setActiveTab,
} = reportSlice.actions;
export default reportSlice.reducer;
