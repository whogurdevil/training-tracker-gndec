import React, { useEffect, useState, forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { CircularProgress } from '@mui/material';
import {
    CategoryScale, LinearScale, Chart, BarElement, Title,
    Tooltip,
    Legend
} from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title,
    Tooltip,
    Legend);

const LineGraph = forwardRef(({ data, years }, ref) => {
    const [chartData, setChartData] = useState(null);
    const[maxPlaced, SetmaxPlaced] = useState(10)

    useEffect(() => {
        if (data) {
            const batchWiseData = {};
            const maleData = {};
            const femaleData = {};
            const currentDate = new Date();
            const cutoffYear = currentDate.getFullYear() - years;

            data.forEach((student) => {
                const startYear = parseInt(student.userInfo.batch.split('-')[0]);
                const isPlaced = student.placementData.isPlaced;
                const gender = student.userInfo.gender;

                if (isPlaced && startYear >= cutoffYear) {
                    batchWiseData[startYear] = batchWiseData[startYear] || { total: 0, placed: 0 };
                    batchWiseData[startYear].total++;
                    batchWiseData[startYear].placed++;

                    if (gender === 'Male') {
                        maleData[startYear] = maleData[startYear] || 0;
                        maleData[startYear]++;
                    } else if (gender === 'Female') {
                        femaleData[startYear] = femaleData[startYear] || 0;
                        femaleData[startYear]++;
                    }
                }
            });

            const labels = Object.keys(batchWiseData);
            const placedMaleStudents = labels.map((year) => maleData[year] || 0);
            const placedFemaleStudents = labels.map((year) => femaleData[year] || 0);
            const maxPlacedStudentsMale = Math.max(...placedMaleStudents);
            const maxPlacedStudentsFemale = Math.max(...placedFemaleStudents);
            const maxPlacedStudents = Math.max(maxPlacedStudentsFemale,maxPlacedStudentsMale);
            SetmaxPlaced(maxPlacedStudents)

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Male Students',
                        data: placedMaleStudents,
                        tension: 0.1,
                        backgroundColor: '#5D6D7E',

                       
                    },
                    {
                        label: 'Female Students',
                        data: placedFemaleStudents,
                        tension: 0.1,
                        backgroundColor: '#EC7063',
                    }
                ]
            });
        }
    }, [data, years]);

    return (
        <div style={{ width: '580px', height: '290px' }}>
            {chartData ? (
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
                                    text: 'Batches'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Placed Students'
                                },
                                beginAtZero: true,
                                max: maxPlaced
                            }
                        },
                        plugins: {
                            tooltip: {
                                enabled: true
                            },
                            title: {
                                display: true,
                                text: 'Batch and Gender Wise Placement Data'
                            }
                        }
                    }}
                />
            ) : (
                <CircularProgress />
            )}
        </div>
    );
});

export default LineGraph;
