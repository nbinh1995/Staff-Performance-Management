import {createSlice} from "@reduxjs/toolkit";
import {errorAlert, successAlert} from "../../helper/alerts";

const initialState = {users: [], page_count: 0, is_loading: true, query: {page: 1, q: '', by: 'id', order: 'desc'}};

const employeesSlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload.users;
            state.page_count = action.payload.page_count;
        },
        getFail(state) {
            errorAlert('Fail to get users from server.');
        },
        deleteUserFail(state) {
            errorAlert('Fail to delete this user.');
        },
        deleteUserSuccess(state) {
            successAlert('The user was deleted successfully.');
        },
        resetPasswordFail(state)
        {
            errorAlert('Fail to reset this user\'s password.');
        },
        resetPasswordSuccess(state)
        {
            successAlert('The user\'s password was reset successfully. New password sent to user\'s email.');
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
});

export const {
    setUsers,
    getUsers,
    getFail,
    updateUser,
    changeSort,
    changePage,
    changeFilter,
    deleteUserFail,
    deleteUserSuccess,
    resetPasswordFail,
    resetPasswordSuccess,
} = employeesSlice.actions;
export default employeesSlice.reducer;
