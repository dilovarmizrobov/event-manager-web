export const BASE_URL = '/event-manager'

export enum ThemeModeEnum {
    LIGHT = "LIGHT",
    DARK = "DARK",
}

export enum UserRolesEnum {
    ADMIN = "ADMIN",
    ADMIN_EVENT = "ADMIN_EVENT",
    GUARD = "GUARD",
    EMPLOYEE = "EMPLOYEE"
}

export const UserRolesMap = new Map(
    [
        [UserRolesEnum.ADMIN, 'Админ'],
        [UserRolesEnum.ADMIN_EVENT, 'Администратор мероприятия'],
        [UserRolesEnum.GUARD, 'Охранник'],
        [UserRolesEnum.EMPLOYEE, 'Сотрудник'],
    ]
)

export enum GuestTypeEnum {
    COMMON = "COMMON",
    VIP = "VIP"
}

export const GuestTypeMap = new Map(
    [
        [GuestTypeEnum.COMMON, 'Обычный'],
        [GuestTypeEnum.VIP, 'VIP'],
    ]
)