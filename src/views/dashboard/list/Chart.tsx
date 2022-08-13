import * as React from 'react';
import {Typography} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {ResponsiveContainer} from "recharts";
import {IChart} from "../../../models/Dashboard";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },

    },
};

 const Chart: React.FC<{chart: IChart[]}> = ({chart}) => {
      const data = {
         labels: chart.map(item => item.time),
         datasets: [
             {
                 label: 'Присутствовали',
                 data: chart.map((item) => item.count),
                 borderColor: 'rgba(51, 128, 255, 1)',
                 backgroundColor: 'rgba(47, 128, 237, 1)',
             },
         ],
     };

    return (
        <>
           <Typography variant={"h5"}>Графа прихода</Typography>
           <ResponsiveContainer>
               <Line options={options} data={data} />
           </ResponsiveContainer>
        </>
    );
}

export default Chart;
