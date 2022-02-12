import URL from '../../constants/urlAuth';
import http from "../../helper/http";
export function login({email,password}){
    return http().post(`${URL.LOGIN}`, {email, password});
}

export function logout() {
    return http().post(`${URL.LOGOUT}`);
}

export function refresh(){
    return http().post(`${URL.REFRESH}`);
}
