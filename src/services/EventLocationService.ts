import {ILocation} from "../models/ILocation";
import apiHelper from "./ApiHelper";

class EventLocationService {
    getLocation = (locationId: string) => apiHelper.get(`/locations/${locationId}`)

    getLocations = () => apiHelper.get(`/locations`)

    postNewLocation = (location: ILocation) => apiHelper.post<ILocation>(`/locations`, location)

    putUpdateLocation = (location: ILocation) => apiHelper.put<ILocation>(`/locations/${location.id!}`, location)

    deleteLocation = (locationId: number) => apiHelper.delete(`/locations/${locationId}`)
}

const eventLocationService = new EventLocationService()

export default eventLocationService