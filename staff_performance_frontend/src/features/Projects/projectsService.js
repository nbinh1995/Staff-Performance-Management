import URL_INDEX from "constants/projectApi";
import {GET_USERS} from '../../constants/employeeAPI'
import http from "../../helper/http";

export function getProjectsList(params = {page: 1, q: '', by: 'id', order: 'desc'}){
    return http().get(URL_INDEX, {
        params: params,
    });
}

export function storeProject(data){
    return http().post(`${URL_INDEX}/store`, data);
}

export function showProject(id){
    return http().get(`${URL_INDEX}/${id}`);
}

export function editProject(id){
    return http().get(`${URL_INDEX}/${id}/edit`);
}

export function updateProject(id,data){
    return http().put(`${URL_INDEX}/${id}/update`, data);
}

export function destroyProject(id){
    return http().delete(`${URL_INDEX}/${id}/destroy`);
}

export function getAllUser(){
    return http().post(`${GET_USERS}/all`);
}
