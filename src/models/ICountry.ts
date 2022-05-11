export interface ICountryResponse {
    id: number;
    flag: string;
    name: string;
    abbr: string;
}

export interface ICountryRequest {
    id?: number;
    flag?: File;
    name: string;
    abbr: string;
}