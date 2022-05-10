import {IUser} from "../models/IUser";

export default function hasPermission(permissions: string[]) {
    const localUser = localStorage.getItem('user')

    if (localUser === null) return false

    const user = JSON.parse(localUser) as IUser

    return user.roles?.findIndex(r => permissions.indexOf(r) > -1) > -1;
}