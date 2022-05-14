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
}