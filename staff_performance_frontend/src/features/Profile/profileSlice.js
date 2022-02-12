import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {errorAlert} from "../../helper/alerts";
import {getEffortData, getUserData, getUserTasks} from "./profileService";

export const fetchUserData = createAsyncThunk(
    'profile/fetchUserData',
    async () => {
        return await getUserData()
                .then(response => {
                    return response.data;
                }).catch(() => {
                    return false;
                });
    }
);

export const fetchEffortData = createAsyncThunk(
    'profile/fetchEffortData',
    async () => {
        return await getEffortData()
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    }
);

export const fetchTasksData = createAsyncThunk(
    'profile/fetchTasksData',
    async (query) => {
        return await getUserTasks(query)
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    }
);

const initialState = {
    user: {},
    tasks: [],
    page_count: 0,
    query: {page: 1, q: '', by: 'id', order: 'desc'},
    efforts: [],
};

const ProfileSlice = createSlice({
    initialState: initialState,
    name: 'profile',
    reducers: {
        setPageCount(state, action) {
            state.page_count = action.payload.page_count;
        },
        fetchFail(state) {
            state.is_loading = false;
        },
        changeSort(state, action) {
            state.query.by = action.payload.by;
            state.query.order = action.payload.order;
        },
        changePage(state, action) {
            state.query.page = action.payload.page;
        },
        changeFilter(state, action) {
            state.query.q = action.payload.q;
        },
    },
    extraReducers: {
        [fetchUserData.fulfilled]: (state, action) => {
            if(action.payload) {
                state.user = action.payload.data;
            }
        },
        [fetchEffortData.fulfilled]: (state, action) => {
            if(action.payload) {
                state.efforts = action.payload.data;
            }
        },
        [fetchTasksData.fulfilled]: (state, action) => {
            if(action.payload) {
                state.tasks = action.payload.data.data;
                state.page_count = action.payload.data.last_page;
            }
        },
    }
});

export const {
    setUser,
    getUserFail,
    setTasks,
    fetchFail,
    setPageCount,
    changePage,
    changeFilter,
    changeSort,
    setEfforts,
} = ProfileSlice.actions;
export default ProfileSlice.reducer;
