import api from "../utils/api";
import {IGuest} from "../models/IGuest";

class GuestService {
    getGuest = (guestId: string) => new Promise((resolve, reject)  => {
        api.get(`/guests/${guestId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getListGuests = (page: number, size: number, search: string, countryId: number) => new Promise((resolve, reject)  => {
        api.get(`/guests${countryId ? `${encodeURI(`?extraParams[countryId]=${countryId}`)}` : ``}`, {params: {search, size, page}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewGuest = (guest: IGuest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('photo', guest.photo!, 'photo.jpg');
        formData.append('passportImage', guest.passportImage!, 'passportImage.jpg');

        delete guest.photo
        delete guest.passportImage

        const json = JSON.stringify(guest);
        const blob = new Blob([json], {type: 'application/json'});

        formData.append('request', blob);

        api.post(`guests`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateGuest = (guest: IGuest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('photo', guest.photo || "");
        formData.append('passportImage', guest.passportImage || "");

        delete guest.photo
        delete guest.passportImage

        const json = JSON.stringify(guest);
        const blob = new Blob([json], {type: 'application/json'});

        formData.append('request', blob);

        api.put(`guests/${guest.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getPrintBadgeGuests = (guestIds: number[]) => new Promise((resolve, reject)  => {
        api.get(`/guests/badge?guestIds=${guestIds.join(',')}`, {responseType: "blob"})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getVerifyGuest = (locationId: number, barcode: string) => new Promise((resolve, reject)  => {
        api.get(`/guests/check`, {params: {locationId, barcode}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const guestService = new GuestService()

export default guestService