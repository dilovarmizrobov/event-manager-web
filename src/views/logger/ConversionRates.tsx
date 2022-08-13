import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {IRate} from "../../models/Dashboard";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Загруженность по типу бейджов',
        },
    },
};

const ConversionRates:React.FC<{rate: IRate[]}> = ({rate}) => {
     const data = {
        labels: rate.map(item => item.name),
        datasets: [
            {
                label: 'Отсутствовали',
                data: rate.map(item => item.absent),
                backgroundColor: 'rgba(47, 128, 237, 1)',
            },
            {
                label: 'Присутствовали',
                data: rate.map(item => item.attended),
                backgroundColor: 'rgba(0, 196, 223, 1)',
            },
        ],
    };
    return (
        <React.Fragment>
            <Bar options={options} data={data} />
        </React.Fragment>
    );
};

export default ConversionRates;
