import api from "../utils/api";

class EventLocationService {
    getLocations = () => new Promise((resolve, reject)  => {
        api.get(`/locations`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const eventLocationService = new EventLocationService()

export default eventLocationService