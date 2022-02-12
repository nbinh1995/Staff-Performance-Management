import * as profile from "../../constants/profileAPI";
import http from "../../helper/http";

export function getUserData() {
    return http().get(profile.PROFILE);
}

export function getUserTasks(params = {page: 1, q: '', by: 'id', order: 'desc'}) {
    return http().get(profile.TASKS, {
        params: params,
    });
}

export function getEffortData() {
    return http().get(profile.EFFORTS);
}
