import {UserRolesEnum} from "./index";

const PERMISSIONS = {
    LIST: {
        DASHBOARD: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT,
            UserRolesEnum.EMPLOYEE,
        ],
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
        ],
        BADGE: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT
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
        ],
        BADGE: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT
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
        ],
        BADGE: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT
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
        ],
        BADGE: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ADMIN_EVENT
        ]
    },
    PRINT_BADGE: [
        UserRolesEnum.ADMIN,
        UserRolesEnum.ADMIN_EVENT,
        UserRolesEnum.EMPLOYEE,
    ],
    IMPORT_GUEST: [
        UserRolesEnum.ADMIN,
        UserRolesEnum.ADMIN_EVENT,
    ],
    ISSUE_BADGE: [
        UserRolesEnum.ADMIN,
        UserRolesEnum.ADMIN_EVENT,
        UserRolesEnum.EMPLOYEE,
    ],
    SELECT_GUEST: [
        UserRolesEnum.ADMIN,
        UserRolesEnum.ADMIN_EVENT,
        UserRolesEnum.EMPLOYEE,
    ]
}

export default PERMISSIONS
