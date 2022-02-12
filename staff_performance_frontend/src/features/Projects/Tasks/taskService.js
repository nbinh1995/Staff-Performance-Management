import { URL_TASK } from "../../../constants/projectApi";
import URL_INDEX from "../../../constants/projectApi";
import { authHeader } from "../../../helper/auth-header";
import http from "../../../helper/http";

export function getTaskList(params = {page: 1, q: '' ,id:0}){
    return http().get(`${URL_TASK}/${params.id}/list`, {
        params: params,
    });
}

export function storeTask(data){
    return http().post(`${URL_TASK}/store`, data);
}

export function editTask(id){
    return http().get(`${URL_TASK}/${id}/edit`);
}

export function updateTask(id,data){
    return http().put(`${URL_TASK}/${id}/update`, data);
}

export function destroyTask(id){
    return http().delete(`${URL_TASK}/${id}/destroy`);
}

export function getUserByProject(id){
    return http().post(`${URL_INDEX}/${id}/get-user-of-project`);
}
