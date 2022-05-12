import {BASE_URL} from "../constants";

export const pathCountryImage = (name: string) => `${BASE_URL}/countries/load-image/${name}`
export const pathGuestImage = (name: string) => `${BASE_URL}/guests/load-image/${name}`