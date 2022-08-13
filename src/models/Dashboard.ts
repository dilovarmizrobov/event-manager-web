export interface IDashboard {
    progress: IProgress;
    chart: IChart[];
    rate: IRate[];
}

export interface IProgress {
    attended: number;
    absent: number;
}

export interface IChart {
    time: string;
    count: number;
}

export interface IRate {
    name: string;
    attended: number;
    absent: number;
}
