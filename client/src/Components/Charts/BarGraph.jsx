import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    CategoryScale, LinearScale, Chart, BarElement, Title,
    Tooltip,
    Legend
} from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title,
    Tooltip,
    Legend);
// import jsPDF from 'jspdf';
import { Box, Button, CircularProgress } from '@mui/material';
// import { useLocation } from 'react-router-dom';

const BarGraph = ({data}) => {
    console.log(data)
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (data) {
            const batchWiseData = {};

            data.forEach((student) => {
                const startYear = parseInt(student.userInfo.batch.split('-')[0]);
                const isPlaced = student.placementData.isPlaced;

                if (isPlaced) {
                    batchWiseData[startYear] = batchWiseData[startYear] || { total: 0, placed: 0 };
                    batchWiseData[startYear].total++;
                    batchWiseData[startYear].placed++;
                }
            });

            const labels = Object.keys(batchWiseData);
            const placedStudents = labels.map((year) => batchWiseData[year]?.placed || 0);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Number of Placed Students',
                        data: placedStudents,
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1
                    }
                ]
            });
        }

    }, [data]);


    return (
        <div style={{
            width:'580px',
            height:'290px'
        }}>
            {chartData ? (
                <>

                    <Bar
                        ref={chartRef}
                        data={chartData}
                        options={{
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            scales: {
                              
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Batches', // X-axis label
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Placed Students', // Y-axis label
                                    },
                                    beginAtZero: true,
                                    max: 5
                                },

                            },
                            plugins: {
                                tooltip: {
                                    enabled: true
                                },
                                title: {
                                    display: true,
                                    text: 'Batch Wise Placement Data',
                                },

                            }

                        }}

                    />


                </>
            ) : (

                <CircularProgress />

            )}
        </div>
    );
};

export default BarGraph;
