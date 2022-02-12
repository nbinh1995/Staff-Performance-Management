import * as employeeAPI from '../../constants/employeeAPI.js';
import http from "../../helper/http";

function fetchUsers(params = {page: 1, q: '', by: 'id', order: 'desc'}) {
    return http().get(employeeAPI.GET_USERS, {
        params: params,
    });
}

function fetchDeleteUser(user) {
    return http().delete(employeeAPI.DELETE_USER(user.id));
}

function fetchResetPassword(id)
{
    return http().post(employeeAPI.RESET_PASSWORD(id));
}

export {fetchUsers, fetchDeleteUser, fetchResetPassword};
