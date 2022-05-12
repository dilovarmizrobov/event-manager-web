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