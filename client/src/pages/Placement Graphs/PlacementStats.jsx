import React, { useEffect, useState, useRef } from 'react';

import jsPDF from 'jspdf';
import { Box, Button, Grid , Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BarGraph from '../../Components/Charts/BarGraph';
import LineGraph from '../../Components/Charts/LineGraph';

const PlacementStats = () => {
    const [updatedata, setUpdateddata] = useState(null)
    const location = useLocation();
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const data = location.state ? location.state.data : null;
    // console.log(data)
    // console.log(chartData)
    useEffect(() => {
        if (data) {

            setUpdateddata(data);

        }

    }, [data]);

    const handleDownloadPDF = () => {
        if (chartRef1.current && chartRef2.current) {
            const doc = new jsPDF({
                unit: 'px',
                format: 'letter',
                userUnit: 300
            });

            // Capture canvas images
            const canvas1 = chartRef1.current.canvas;
            const canvas2 = chartRef2.current.canvas;

            // Add canvas images to PDF
            doc.text('Batch-wise Placed Student Percentages', 130, 40);
            doc.addImage(canvas1.toDataURL('image/png'), 'PNG', 40, 80, 360, 200);
            doc.addImage(canvas2.toDataURL('image/png'), 'PNG', 40, 300, 360, 200);

            // Save PDF
            doc.save('placement_graph.pdf');
        }
    };
    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom>
                Placement Graphs
            </Typography>

            <Grid container spacing={2} marginTop={2} gap={4} marginInline={2}>
                <Box sx={{
                    width: '600px', // Set width of the box
                    height: '300px', // Set height of the box
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #ccc', // Add a border
                    borderRadius: '8px', // Add border radius
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', // Add box shadow
                }}>
                    <BarGraph data={updatedata} ref={chartRef1} />
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
                    <LineGraph data={updatedata} ref={chartRef2} />
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
