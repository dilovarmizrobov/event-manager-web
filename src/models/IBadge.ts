export interface IBadgeResponse {
    id: number;
    name: string;
    fileName: string;
}

export interface IBadgeRequest {
    id?: number;
    name: string;
    files?: File[];
}

export interface IBadgeOption {
    id: number;
    name: string;
}