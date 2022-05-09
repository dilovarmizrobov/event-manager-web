export interface IEventResponse{
    id: number;
    createdDate: string;
    updatedDate: string;
    name: string;
    fromDate: string;
    toDate: string;
    active: boolean;
}

export interface IEventRequest{
    id?: number;
    name: string;
    fromDate: string;
    toDate: string;
}