import {ILocation} from "./ILocation";
import {ICountryResponse} from "./ICountry";
import {IBadgeOption} from "./IBadge";

export interface IGuest {
    [key: string]: any;
    id?: number;
    barcode?: string;
    badgeIssued?: boolean;
    fullName: string;
    passport: string;
    passportImage?: string | File;
    photo?: string | File;
    email: string;
    type: number | IBadgeOption;
    countryId: number;
    country?: ICountryResponse;
    locations: number[] | ILocation[];
    qty?: number;
}