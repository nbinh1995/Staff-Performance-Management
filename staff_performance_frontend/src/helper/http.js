import axios from "axios";
import * as alert from "./alerts";
import {store} from "./store";
import {clearLoggedInUser} from "../features/Auth/authSlice";
import {authHeader} from "./auth-header";
import {setLoading} from "./appSlice";
import {history} from "./history";

const handleErrors = (code) => {
    if (code !== 422) {
        switch (code) {
            case 404:
                alert.warningAlert('Your request not found.');
                break;
            case 401:
                if (!localStorage.getItem('user')) {
                    alert.errorAlert('Your email or password is invalid.');
                } else {
                    alert.infoAlert('Please login before continue.');
                    store.dispatch(clearLoggedInUser());
                    history.push({pathname: '/login'});
                }
                break;
            case 500:
                alert.errorAlert('Server error. Please try again.');
                break;
            case 'Network Error':
                alert.errorAlert('Can\'t connect to the server. Please try again.');
                break;
            default:
                alert.infoAlert('There was an error. Please try again.');
                break;
        }
    }
};

const instance = axios.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(function (config) {
    store.dispatch(setLoading({isLoading: true}));
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    store.dispatch(setLoading({isLoading: false}));
    return response;
}, function (error) {
    if (error && (error.response || error.message === 'Network Error')) {
        const errorCode = error.response?.status || error.message;
        handleErrors(errorCode);
    }
    store.dispatch(setLoading({isLoading: false}));
    return Promise.reject(error);
});

const http = () => {
    if (Object.keys(authHeader()).length) {
        instance.defaults.headers = Object.assign({}, instance.defaults.headers, authHeader());
    }

    return instance;
}

export default http;
