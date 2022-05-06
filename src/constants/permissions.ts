export const ADMIN = 'ADMIN';
export const MANAGER = 'MANAGER';

const PERMISSIONS = {
    LIST: {
        ADMIN: [
            ADMIN,
        ],
        MANAGER: [
            ADMIN,
            MANAGER,
        ]
    },
    CREATE: {},
    EDIT: {},
    DELETE: {},
}

export default PERMISSIONS
