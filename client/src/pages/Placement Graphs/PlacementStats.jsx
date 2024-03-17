import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
// import {
//     CategoryScale, LinearScale, Chart, BarElement, Title,
//     Tooltip,
//     Legend } from 'chart.js';
// Chart.register(CategoryScale, LinearScale, BarElement, Title,
//     Tooltip,
//     Legend);
import jsPDF from 'jspdf';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BarGraph from '../../Components/Charts/BarGraph';

const PlacementStats = () => {
    const [updatedata, setUpdateddata] = useState(null)
    const location = useLocation();
    const data = location.state ? location.state.data : null;
    // console.log(data)
    // console.log(chartData)
    useEffect(() => {
        if (data) {

            setUpdateddata(data);

        }

    }, [data]);

    const handleDownloadPDF = () => {
        if (chartData && chartRef.current) {
            const chartInstance = chartRef.current;
            const chartCanvas = chartInstance.canvas;
            const chartImage = chartCanvas.toDataURL('image/png');
            const doc = new jsPDF({
                unit: 'px',
                format: 'letter',
                userUnit: 300
            });
            doc.text('Batch-wise Placed Student Percentages', 40, 30);
            doc.addImage(chartImage, 'PNG', 40, 80, 360, 200);
            doc.save('placement_graph.pdf');
        }
    };
    return (
        <div>


            <Grid container spacing={2} marginTop={5} gap={4} marginInline={2}>
                <Box sx={{
                    width: '600px', // Set width of the box
                    height: '300px', // Set height of the box
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #ccc', // Add a border
                    borderRadius: '8px', // Add border radius
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', // Add box shadow
                }}>
                    <BarGraph data={updatedata} />
                </Box>
                <Box sx={{
                    width: '600px', // Set width of the box
                    height: '300px', // Set height of the box
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #ccc', // Add a border
                    borderRadius: '8px', // Add border radius
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', // Add box shadow
                }}>
                    <BarGraph data={updatedata} />
                </Box>
            </Grid>
            <Box sx={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center'
            }
            }>
                <Button onClick={handleDownloadPDF} variant="contained" color="primary">
                    Download Statistics (PDF)
                </Button>
            </Box>


        </div>
    );
};

export default PlacementStats;
