import ENV from '../env';
import MASTER from "./master";

export const GET_USERS = ENV.DOMAIN + '/api/admin/user';
export const GET_USER = (id) => ENV.DOMAIN + `/api/admin/user/${id}/show`;
export const USER_AVATAR = ENV.DOMAIN + MASTER.STORAGE_PATH;
export const DELETE_USER = (id) => ENV.DOMAIN + `/api/admin/user/${id}/destroy`;
export const UPDATE_USER = (id) => ENV.DOMAIN + `/api/admin/user/${id}/update`;
export const GET_GROUP_ROLE = ENV.DOMAIN + '/api/admin/user/group-role';
export const ADD_USER = ENV.DOMAIN + '/api/admin/user/store';
export const RESET_PASSWORD = (id) => ENV.DOMAIN + `/api/admin/user/${id}/reset-password`;
export const GET_EFFORT = (id) => ENV.DOMAIN + `/api/admin/user/${id}/effort`;
export const GET_TASK = (id) => ENV.DOMAIN + `/api/admin/user/${id}/tasks`;