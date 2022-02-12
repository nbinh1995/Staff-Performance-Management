import ENV from '../env';

const URL_INDEX = `${ENV.DOMAIN}/api/admin/project`;
export const URL_TASK = `${ENV.DOMAIN}/api/admin/task`;

export const STATUS = [
    'pending',
    'completed',
    'cancel'
]


export default URL_INDEX;

