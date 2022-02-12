import http from "../../helper/http";
import * as headerAPI from "../../constants/headerAPI";

function getSummary() {
    return http().get(headerAPI.SUMMARY);
}

export {getSummary};
