// import React, { useEffect } from 'react';
// import { PDFDownloadLink, Document, Page, View, Text } from '@react-pdf/renderer';
// import Chart from 'chart.js/auto';
// import jsPDF from 'jspdf';

// const GeneratePlacementGraphPDF = () => {
//     const data = {
//         "2021": { placed: 10, notPlaced: 5 },
//         "2022": { placed: 10, notPlaced: 5 },
//         "2023": { placed: 10, notPlaced: 5 },
//         "2024": { placed: 10, notPlaced: 5 },
//         "2025": { placed: 10, notPlaced: 5 }
//     };
//     const generateChart = () => {
//         const chartConfig = {
//             type: 'bar',
//             data: {
//                 labels: Object.keys(data),
//                 datasets: [
//                     {
//                         label: 'Placed',
//                         backgroundColor: 'rgba(75,192,192,0.6)',
//                         borderColor: 'rgba(75,192,192,1)',
//                         borderWidth: 1,
//                         hoverBackgroundColor: 'rgba(75,192,192,0.8)',
//                         hoverBorderColor: 'rgba(75,192,192,1)',
//                         data: Object.keys(data).map(year => data[year].placed),
//                     },
//                     {
//                         label: 'Not Placed',
//                         backgroundColor: 'rgba(255,99,132,0.6)',
//                         borderColor: 'rgba(255,99,132,1)',
//                         borderWidth: 1,
//                         hoverBackgroundColor: 'rgba(255,99,132,0.8)',
//                         hoverBorderColor: 'rgba(255,99,132,1)',
//                         data: Object.keys(data).map(year => data[year].notPlaced),
//                     },
//                 ],
//             },
//         };

//         const canvas = document.createElement('canvas');
//         canvas.width = 400; // Set the desired width of the canvas
//         canvas.height = 400; 
//         const ctx = canvas.getContext('2d');

//         new Chart(ctx, chartConfig);
//         console.log(canvas);

//         return ctx.canvas.toDataURL('image/png');
//     };

//     const downloadPDF = () => {
//         const doc = new jsPDF();

//         doc.text('Placement Graph', 10, 10);

//         const chartImage = generateChart();
//         console.log(chartImage);
//         doc.addImage(chartImage, 'PNG', 10, 20, 180, 100);

//         doc.save('placement_graph.pdf');
//     };

//     // Automatically trigger PDF download on component mount
//     useEffect(() => {
//         downloadPDF();
//     }, []);

//     return (
//         <PDFDownloadLink document={<Document />} fileName="placement_graph.pdf">
//             {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
//         </PDFDownloadLink>
//     );
// };

// export default GeneratePlacementGraphPDF;
