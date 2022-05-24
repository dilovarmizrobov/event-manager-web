import {IEventRequest} from "../models/IEvent";
import apiHelper from "./ApiHelper";

class EventService {
    getEvent = (eventId: string) => apiHelper.get(`/events/${eventId}`)

    getOptionEvents = () => apiHelper.get(`/events/option`)

    getListEvents = (page: number, size: number, search: string, startDate?: string, endDate?: string) =>
        apiHelper.get(`/events`, {search, startDate, endDate, size, page})

    postNewEvent = (event: IEventRequest) => apiHelper.post<IEventRequest>(`/events`, event)

    putUpdateEvent = (event: IEventRequest) => apiHelper.put<IEventRequest>(`/events/${event.id!}`, event)

    deleteEvent = (eventId: number) => apiHelper.delete(`/events/${eventId}`)

    completeEvent = (eventId: number) => apiHelper.get(`/events/${eventId}/complete`)
}

const eventService = new EventService();

export default eventService;