import * as employeeAPI from "../../../constants/employeeAPI";
import http from "../../../helper/http";
import {format} from "date-fns";

function fetchGroupRole() {
    return http().get(employeeAPI.GET_GROUP_ROLE);
}

function fetchAddUser(data) {
    var formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
    return http().post(employeeAPI.ADD_USER, formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
}

function fetchUser(id) {
    return http().get(employeeAPI.GET_USER(id));
}

function fetchUpdateUser(id, data) {
    var formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
    formData.append('_method', 'put');
    return http().post(employeeAPI.UPDATE_USER(id), formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
}

function fetchEffort(id) {
    return http().get(employeeAPI.GET_EFFORT(id));
}

function getUserTasks(id, params = {page: 1, q: '', by: 'id', order: 'desc'}) {
    return http().get(employeeAPI.GET_TASK(id), {
        params: params,
    });
}

export {fetchGroupRole, fetchAddUser, fetchUser, fetchUpdateUser, fetchEffort, getUserTasks};
