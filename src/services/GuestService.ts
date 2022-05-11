import api from "../utils/api";
import {IGuest} from "../models/IGuest";
import apiHelper from "./ApiHelper";

class GuestService {
    getGuest = (guestId: string) => apiHelper.get(`/guests/${guestId}`)

    getListGuests = (page: number, size: number, search: string, countryId: number) => {
        let extraParams
        countryId && (extraParams = {countryId})
        return apiHelper.get(`/guests`, {search, size, page, extraParams})
    }

    postNewGuest = (guest: IGuest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('photo', guest.photo!, 'photo.jpg');
        formData.append('passportImage', guest.passportImage!, 'passportImage.jpg');

        const json = {
            fullName: guest.fullName,
            passport: guest.passport,
            email: guest.email,
            type: guest.type,
            countryId: guest.countryId,
            locations: guest.locations,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('request', blob);

        api.post(`guests`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateGuest = (guest: IGuest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('photo', guest.photo || "");
        formData.append('passportImage', guest.passportImage || "");

        const json = {
            id: guest.id,
            fullName: guest.fullName,
            passport: guest.passport,
            email: guest.email,
            type: guest.type,
            countryId: guest.countryId,
            locations: guest.locations,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('request', blob);

        api.put(`guests/${guest.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getPrintBadgeGuests = (guestIds: number[]) =>
        apiHelper.get(`/guests/badge?guestIds=${guestIds.join(',')}`, {responseType: "blob"})

    getVerifyGuest = (locationId: number, barcode: string) =>
        apiHelper.get(`/guests/check`, {locationId, barcode})

    deleteGuest = (guestId: number) => apiHelper.delete(`/guests/${guestId}`)
}

const guestService = new GuestService()

export default guestService