export interface IGuest {
    id?: number;
    fullName: string;
    passport: string;
    passportImage?: string;
    photo?: string;
    email: string;
    type: string;
    countryId: number;
    locations: number[];
}