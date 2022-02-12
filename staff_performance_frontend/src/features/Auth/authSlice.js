import {createSlice} from '@reduxjs/toolkit';
import {logout} from './authService';
import {successAlert, errorAlert} from '../../helper/alerts';
import {history} from '../../helper/history';
import http from "../../helper/http";

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? {loggingIn: true, user: user, from: {pathname: '/'}} : {
    loggingIn: false,
    user: {},
    from: {pathname: '/'}
};
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginRequest(state, action) {
            state = {
                loggingIn: true,
                user: action.payload,
            };
        },
        loginSuccess(state, action) {
            if(!localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
            state = {
                loggingIn: true,
                user: action.payload.user,
            };
            //history.push(action.payload.from);
        },
        loginFailure(state) {
            state = {
                loggedIn: false,
            };
        },
        logoutAction(state) {
            logout()
                .then(response => {
                    localStorage.removeItem('user');
                    state = {loggingIn: false, user: {}, from: {pathname: `${process.env.PUBLIC_URL}`}};
                }).then(() => {
                history.push({pathname: `${process.env.PUBLIC_URL}/login`})
            });
        },
        clearLoggedInUser(state) {
            localStorage.removeItem('user');
            state = {loggingIn: false, user: {}, from: {pathname: `${process.env.PUBLIC_URL}`}};
        },
    }
})


export const {loginRequest, loginSuccess, loginFailure, logoutAction, clearLoggedInUser} = authSlice.actions;
export default authSlice.reducer;

export const checkAuth = state => state.auth.loggedIn
