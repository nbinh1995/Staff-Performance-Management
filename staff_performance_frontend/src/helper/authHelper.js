import MASTER from "../constants/master";
import jwt_decode from "jwt-decode";

const useAuth = () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const role = token ? jwt_decode(token).s : null;
    const group = token ? jwt_decode(token).g : null;

    const isAdmin = role === MASTER.ROLE.ADMIN;
    const isLeader = role === MASTER.ROLE.LEADER;
    const isFrontend = group === MASTER.GROUP.FRONTEND;
    const isBackend = group === MASTER.GROUP.BACKEND;
    return {role, isAdmin, isLeader, isFrontend, isBackend};
}


export default useAuth;
