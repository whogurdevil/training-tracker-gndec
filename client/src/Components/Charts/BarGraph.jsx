import React, { useEffect, useState, forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    CategoryScale, LinearScale, Chart, BarElement, Title,
    Tooltip,
    Legend
} from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title,
    Tooltip,
    Legend);
import { CircularProgress } from '@mui/material';

const BarGraph = forwardRef(({ data, years }, ref) => {
    const [chartData, setChartData] = useState(null);
    useEffect(() => {
        if (data) {
            const batchWiseData = {};
            const currentDate = new Date();
            const cutoffYear = currentDate.getFullYear() - years;

            data.forEach((student) => {
                const startYear = parseInt(student.userInfo.batch.split('-')[0]);
                const isPlaced = student.placementData.isPlaced;

                if (isPlaced && startYear >= cutoffYear) {
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

    }, [data, years]);


    return (
        <div style={{
            width:'580px',
            height:'290px'
        }}>
            {chartData ? (
                <>

                    <Bar
                        ref={ref}
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
});

export default BarGraph;
