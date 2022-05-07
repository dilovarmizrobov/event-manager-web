import {GuestTypeEnum} from "../constants";

export interface IGuest {
    [key: string]: any;
    id?: number;
    fullName: string;
    passport: string;
    passportImage?: string | File;
    photo?: string | File;
    email: string;
    type: GuestTypeEnum;
    countryId: number;
    locations: number[];
}