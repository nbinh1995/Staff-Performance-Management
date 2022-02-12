import * as reportAPI from "../../constants/reportAPI";
import http from "../../helper/http";

export function getProjectEffort(from, to) {
    let params = {};
    if(from !== undefined && to !== undefined){
        params = {from: from, to: to};
    }
    return http().get(reportAPI.PROJECT_EFFORT, {
        params: params,
    });
}

export function getGroupEffort(params =  {}) {
    return http().get(reportAPI.GROUP_EFFORT, {
        params: params,
    });
}
