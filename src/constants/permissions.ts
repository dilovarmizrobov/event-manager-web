import {UserRolesEnum} from "./index";

const PERMISSIONS = {
    LIST: {
        EVENT: [
            UserRolesEnum.ADMIN,
        ],
        EVENT_LOCATION: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        COUNTRY: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ]
    },
    CREATE: {
        EVENT: [
            UserRolesEnum.ADMIN,
        ],
        EVENT_LOCATION: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        GUEST: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
            UserRolesEnum.EMPLOYEE,
        ],
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        COUNTRY: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ]
    },
    EDIT: {
        EVENT: [
            UserRolesEnum.ADMIN,
        ],
        EVENT_LOCATION: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        GUEST: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
            UserRolesEnum.EMPLOYEE,
        ],
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        COUNTRY: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ]
    },
    DELETE: {
        EVENT: [
            UserRolesEnum.ADMIN,
        ],
        EVENT_LOCATION: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        GUEST: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
            UserRolesEnum.EMPLOYEE,
        ],
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ],
        COUNTRY: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
        ]
    },
    PRINT: {
        GUEST: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
            UserRolesEnum.EMPLOYEE,
        ],
    }
}

export default PERMISSIONS