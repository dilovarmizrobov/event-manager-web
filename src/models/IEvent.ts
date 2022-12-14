export interface IEventResponse{
    id: number;
    createdDate: string;
    updatedDate: string;
    name: string;
    fromDate: string;
    toDate: string;
    active: boolean;
    registered: number;
    attended: number;
}

export interface IEventRequest{
    id?: number;
    name: string;
    fromDate: string;
    toDate: string;
}

export interface IEventOption {
    id: number;
    name: string;
}