import {UserRolesEnum} from "../constants";
import {IEventOption} from "./IEvent";
import {ILocation} from "./ILocation";

export interface IUser {
    name: string;
    email: string;
    role: UserRolesEnum;
    events?: IEventOption[];
    eventId?: number;
    eventName?: string;
    locations?: ILocation[];
    locationId?: number;
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
    role: UserRolesEnum;
    locations?: number[];
}