import ENV from '../env';
const URL = {
    LOGIN: `${ENV.DOMAIN}/api/auth/login`,
    REFRESH: `${ENV.DOMAIN}/api/auth/refresh`,
    LOGOUT: `${ENV.DOMAIN}/api/auth/logout`
}

export default URL;