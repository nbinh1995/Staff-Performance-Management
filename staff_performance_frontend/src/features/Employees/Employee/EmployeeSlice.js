import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {errorAlert, successAlert} from "../../../helper/alerts";
import {fetchEffort, fetchUser, getUserTasks} from "./EmployeeService";

export const fetchUserData = createAsyncThunk(
    'employee/fetchUserData',
    async (id) => {
        return await fetchUser(id)
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    },
);

export const fetchEffortData = createAsyncThunk(
    'employee/fetchEffortData',
    async (id) => {
        return await fetchEffort(id)
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    },
);

export const fetchTasksData = createAsyncThunk(
    'employee/fetchTasksData',
    async (props) => {
        return await getUserTasks(props.id, props.params)
            .then(response => {
                return response.data;
            }).catch(() => {
                return false;
            });
    },
);

const initialState = {
    groups: [],
    roles: [],
    preview: null,
    user: {},
    efforts: [],
    detail: {
        tasks: [],
        query: {page: 1, q: '', by: 'id', order: 'desc'},
        page_count: 1,
    }
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        getGroupRoleFail(state) {
            errorAlert("Fail to get groups and roles from server.");
        },
        addUserSuccess(state) {
            successAlert("The user was created successfully.");
        },
        addUserFail(state) {
            errorAlert("Fail to create user.");
        },
        setGroupRole(state, action) {
            state.groups = action.payload.groups;
            state.roles = action.payload.roles;
        },
        setPreview(state, action) {
            state.preview = action.payload.preview;
        },
        setEditUser(state, action) {
            state.user = action.payload.user;
        },
        getUserFail(state) {
            state.user = {};
            errorAlert("Fail to get user data from server.");
        },
        updateUserSuccess(state, action) {
            state.user = action.payload.user;
            successAlert("The user was updated successfully.");
        },
        updateUserFail() {
            errorAlert("Fail to update user.");
        },
        changeSort(state, action) {
            state.detail.query.by = action.payload.by;
            state.detail.query.order = action.payload.order;
        },
        changePage(state, action) {
            state.detail.query.page = action.payload.page;
        },
        changeFilter(state, action) {
            state.detail.query.q = action.payload.q;
        },
    },
    extraReducers: {
        [fetchUserData.fulfilled]: (state, action) => {
            state.user = action.payload.data;
        },
        [fetchEffortData.fulfilled]: (state, action) => {
            state.efforts = action.payload.data;
        },
        [fetchTasksData.fulfilled]: (state, action) => {
            state.detail.tasks = action.payload.data.data;
            state.detail.page_count = action.payload.data.last_page;
        },
    },
});

export const {
    fetchRequest,
    getGroupRoleFail,
    addUserFail,
    setGroupRole,
    addUserSuccess,
    setPreview,
    getUserFail,
    setEditUser,
    updateUserSuccess,
    updateUserFail,
    changeFilter,
    changePage,
    changeSort,
    endRequest,
} = employeeSlice.actions;
export default employeeSlice.reducer;
