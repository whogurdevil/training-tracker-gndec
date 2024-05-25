import React, { useEffect, useState, forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    CategoryScale, LinearScale, Chart, BarElement, Title,
    Tooltip,
    Legend
} from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CircularProgress } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompanyGraph = forwardRef(({ data, years }, ref) => {
    const [chartData, setChartData] = useState(null);
    const [maxPackageState, setmaxPackageState]=useState(20);
    
    // Chart.register(ChartDataLabels);

    useEffect(() => {
        if (data) {
            const batchWiseData = {};
            const currentDate = new Date();
            const cutoffYear = currentDate.getFullYear() - years;

            data.forEach((student) => {
                const startYear = parseInt(student.userInfo.batch.split('-')[0]);
                const isPlaced = student.placementData.isPlaced;
                const company = student.placementData.company;
                const salary = student.placementData.package;

                if (isPlaced && startYear >= cutoffYear) {
                    batchWiseData[startYear] = batchWiseData[startYear] || { total: 0, placed: 0, maxPackage: 0, maxCompany: '' };
                    batchWiseData[startYear].total++;
                    batchWiseData[startYear].placed++;

                    // Update max package and company if current student's package is greater
                    if (salary > batchWiseData[startYear].maxPackage) {
                        batchWiseData[startYear].maxPackage = salary;
                        batchWiseData[startYear].maxCompany = company;
                    }
                }
            });

            const labels = Object.keys(batchWiseData).sort(); // Sort the labels array
            const maxPackages = labels.map((year) => (batchWiseData[year]?.maxPackage) || 0);
            const maxPackage= Math.max(...maxPackages);
            setmaxPackageState(maxPackage)
            const companyPackageInfo = labels.map((year) => ({
                company: batchWiseData[year]?.maxCompany || '',
                package: batchWiseData[year]?.maxPackage || 0
            }));

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Maximum Package',
                        data: maxPackages,
                        backgroundColor: '#76D7C4',
                        fill:false,
                        companyPackageInfo: companyPackageInfo // Embed company and package info
                    }
                ]
            });
        }
    }, [data, years]);


    return (
        <div style={{
            width: '580px',
            height: '290px'
        }}>
            {chartData ? (
                
                <>
                    <Bar
                        ref={ref}
                        data={chartData}
                        options={{
                            responsive: true,
                            legend: {
                                display: false,
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
                                        text: 'Package in LPA', // Y-axis label
                                    },
                                    beginAtZero: true,
                                    max: maxPackageState,
                                },
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Batch Wise Highest Packages',
                                },
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        label: function (context) {
                                            const label = context.dataset.label || '';
                                            if (label) {
                                                // Access embedded company and package info from dataset
                                                const companyPackageInfo = context.dataset.companyPackageInfo[context.dataIndex];
                                                return [`Company: ${companyPackageInfo.company}`, `Package: ${companyPackageInfo.package}`];
                                            }
                                            return null;
                                        },
                                    },
                                },
                                
                            },
                        }}
                    />

                </>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
});

export default CompanyGraph;
