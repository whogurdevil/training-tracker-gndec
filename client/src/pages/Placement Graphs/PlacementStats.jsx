import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const PlacementStats = () => {

    const chartCanvasRef = useRef(null);
    const [chartVisible, setChartVisible] = useState(false);
    const [chartInitialized, setChartInitialized] = useState(false);
    const [chartInstance, setChartInstance] = useState(null);

    // Sample data for batch-wise placed student percentages
    const data = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'Placed Percentage',
                data: [80, 75, 85, 70, 90], // Example data for placed percentages
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    useEffect(() => {
        if (chartVisible && !chartInitialized) {
            const ctx = chartCanvasRef.current.getContext('2d');
            Chart.register(ChartDataLabels);
            const newChartInstance = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100 // Setting the max value of y-axis to 100
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: '#333', // Color of the text
                            font: {
                                weight: 'bold' // Font weight of the text
                            },
                            align: 'end',
                            anchor: 'end',
                            formatter: function (value) {
                                return value; // Append '%' to the value
                            }
                        }
                    }
                }
            });
            setChartInstance(newChartInstance);
            setChartInitialized(true);
        }
    }, [chartVisible, chartInitialized, data]);

    const handleDownloadPDF = () => {
        setChartVisible(true);
        exportChartAsPDF();
    };

    const handleDownloadImage = () => {
        setChartVisible(true);
        exportChartAsImage();
    };

    const exportChartAsImage = () => {
        if (chartInstance) {
            setTimeout(() => {
                html2canvas(chartCanvasRef.current).then((canvas) => {
                    const chartImage = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = chartImage;
                    link.download = 'placement_graph.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setChartVisible(false);
                }).catch((error) => {
                    console.error('Error exporting chart canvas:', error);
                });
            }, 1000); // Adjust the delay as needed
        }
    };

    const exportChartAsPDF = () => {
        if (chartInstance) {
            setTimeout(() => {
                const chartCanvas = chartCanvasRef.current;
                const chartImage = chartCanvas.toDataURL('image/png');
                const doc = new jsPDF({
                    unit: 'px', // Set the units of measurement to px
                    format: 'letter', // Set the 'paper' size
                    userUnit: 300 // Set the DPI here. Web uses 72 but you can change to 150 or 300
                });
                doc.text('Batch-wise Placed Student Percentages', 40, 30);
                doc.addImage(chartImage, 'PNG', 40, 80, 360, 200);
                doc.save('placement_graph.pdf');
                setChartVisible(false);
            }, 1000); // Adjust the delay as needed
        }
    };

    return (
        <>

            <canvas ref={chartCanvasRef} style={{ display: chartVisible ? 'block' : 'none' }} />

            <Button onClick={handleDownloadPDF} variant="contained" color="primary">
                Placement Statistics (PDF)
            </Button>
            <Button onClick={handleDownloadImage} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                Placement Statistics (PNG)
            </Button>


        </>
    );

};

export default PlacementStats;
