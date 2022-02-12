const MASTER = {
    GROUP: {
        MANAGEMENT: 'management',
        BACKEND: 'backend',
        FRONTEND: 'frontend',
    },
    ROLE: {
        ADMIN: 'admin',
        LEADER: 'leader',
        STAFF: 'staff',
    },
    STORAGE_PATH: '/storage/',
    AVATAR: {
        FILE_SIZE: 2, //MB
        FILE_MIMES: ['png', 'jpg', 'jpeg'],
    },
    STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        CANCEL: 'cancel',
    },
}

export default MASTER;