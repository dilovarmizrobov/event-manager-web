import {UserRolesEnum} from "../constants";
import {IEventOption} from "./IEvent";
import {ILocation} from "./ILocation";

export interface IUser {
    name: string;
    email: string;
    role: UserRolesEnum;
    event?: IEventOption;
    eventName?: string;
    location?: ILocation;
    verify: boolean;
}

export interface IUserResponse {
    id: number;
    fullName: string;
    role: UserRolesEnum;
    locations?:  ILocation[];
    phoneNumber: string;
    email: string;
}

export interface IUserRequest {
    id?: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: UserRolesEnum;
    locations?: number[];
}