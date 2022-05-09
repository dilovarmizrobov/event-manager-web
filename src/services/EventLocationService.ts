import api from "../utils/api";
import {ILocation} from "../models/ILocation";

class EventLocationService {
    getLocation = (locationId: string) => new Promise((resolve, reject)  => {
        api.get(`/locations/${locationId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getLocations = () => new Promise((resolve, reject)  => {
        api.get(`/locations`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewLocation = (location: ILocation) => new Promise((resolve, reject) => {
        api.post(`/locations`, location)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateLocation = (location: ILocation) => new Promise((resolve, reject) => {
        api.put(`/locations/${location.id!}`, location)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const eventLocationService = new EventLocationService()

export default eventLocationService