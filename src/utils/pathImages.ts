import {BASE_URL} from "../constants";

export const pathCountryImage = (name: string) => `${BASE_URL}/countries/load-image/${name}`
export const pathBadgeImage = (name: string) => `${BASE_URL}/badge-templates/load-badge/${name}`
export const pathGuestImage = (name: string) => `${BASE_URL}/guests/load-image/${name}`