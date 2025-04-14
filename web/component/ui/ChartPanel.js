import React from "react";
import {Line} from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const ChartPanel = (dataProp) => {

            return (
                <Line data={
                    {
                        datasets: [
                            {
                                data: dataProp,
                                borderColor: "rgba(75,192,192,1)",
                                backgroundColor: "rgba(75,192,192,0.2)",
                                borderWidth: 1,
                                pointRadius: 2,
                                tension: 0.4
                            }
                        ]
                    }
                } options={
                    {
                        scales:{
                            x: {
                                display: false
                            },
                            y: {
                                display: false
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                } />
            );
        };

export default ChartPanel;
