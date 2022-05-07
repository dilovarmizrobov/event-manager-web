import {UserRolesEnum} from "../constants";

export interface IUser {
    name: string;
    roles: UserRolesEnum[];
    email: string;
}