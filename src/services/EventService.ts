import api from "../utils/api";
import {IEventRequest} from "../models/IEvent";

class EventService {
    getEvent = (eventId: string) => new Promise((resolve, reject)  => {
        api.get(`/events/${eventId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getListEvents = (page: number, size: number, search: string, startDate: string, endDate: string) => new Promise((resolve, reject)  => {
        api.get(`/events`, {params: {search, startDate, endDate, size, page}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewEvent = (eventsRequest: IEventRequest) => new Promise((resolve, reject) => {
        api.post(`/events`, eventsRequest)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateEvent = (eventsRequest: IEventRequest) => new Promise((resolve, reject) => {
        api.put(`/events/${eventsRequest.id!}`, eventsRequest)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const eventService = new EventService();
export default eventService;