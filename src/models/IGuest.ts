import {GuestTypeEnum} from "../constants";
import {ILocation} from "./ILocation";
import {ICountryResponse} from "./ICountry";

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
    country?: ICountryResponse;
    locations: number[] | ILocation[];
}