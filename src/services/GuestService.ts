import api from "../utils/api";
import {IGuest} from "../models/IGuest";

class GuestService {
    postNewGuest = (guest: IGuest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('photo', guest.photo!, 'chris.jpg');
        formData.append('passportImage', guest.passportImage!, 'chris.jpg');

        delete guest.photo
        delete guest.passportImage

        const json = JSON.stringify(guest);
        const blob = new Blob([json], {type: 'application/json'});

        formData.append('request', blob);

        api.post(`guests`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const guestService = new GuestService()

export default guestService