import React from 'react';
import { Button, Box } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import { base64toBlob , openBase64NewTab } from './base64topdf'  
const ExportComponent = ({ data, selectedTraining }) => {
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });


    const handleExportData = () => {
        const filteredData = data.map(row => {
            const filteredRow = {};

            if (selectedTraining && selectedTraining !== "placementData") {
                if (row[selectedTraining]) {
                    filteredRow['URN'] = row.urn;
                    const trainingData = row[selectedTraining];
                    filteredRow['Organization'] = trainingData.organization;
                    filteredRow['Technology'] = trainingData.technology.join(', ');
                    filteredRow['Project Name'] = trainingData.projectName;
                    filteredRow['Type'] = trainingData.type;
                    filteredRow['Lock'] = trainingData.lock ? 'Yes' : 'No';

                    // Convert certificate to data URL
                    if (trainingData.certificate) {
                        const certificateBlob = base64toBlob(trainingData.certificate);
                        const linkcertificate = URL.createObjectURL(certificateBlob)
                        filteredRow['Certificate'] = linkcertificate;
                    

                    } else {
                        filteredRow['Certificate'] = '';
                    }
                } else {
                    return {};
                }
            } else if (selectedTraining && selectedTraining === "placementData") {
                if (row[selectedTraining]) {
                    filteredRow['URN'] = row.urn;
                    const trainingData = row[selectedTraining];
                    filteredRow['Company'] = trainingData.company;
                    filteredRow['Placement Type'] = trainingData.placementType;
                    filteredRow['Appointment Number'] = trainingData.appointmentNo;
                    filteredRow['Package'] = trainingData.package;
                    filteredRow['Lock'] = trainingData.lock ? 'Yes' : 'No';

                    // Convert appointment letter to data URL
                    if (trainingData.appointmentLetter) {
                        const appointmentLetterBlob = base64toBlob(trainingData.appointmentLetter);
                        filteredRow['Appointment Letter'] = `<a href="${URL.createObjectURL(appointmentLetterBlob)}" target="_blank">Download</a>`;

                    } else {
                        filteredRow['Appointment Letter'] = '';
                    }
                } else {
                    return {};
                }
            } else {
                filteredRow['Name'] = row.userInfo.Name;
                filteredRow['URN'] = row.urn;
                filteredRow['CRN'] = row.userInfo.crn;
                filteredRow['Mentor'] = row.userInfo.mentor;
                filteredRow['Admission Type'] = row.userInfo.admissionType;
                filteredRow['Batch'] = row.userInfo.Batch;
            }

            return filteredRow;
        }).filter(row => Object.keys(row).length > 0);

        const csv = generateCsv(csvConfig)(filteredData);
        download(csvConfig)(csv);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap',
            }}
        >
            <Button
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
            >
                Export Data
            </Button>
        </Box>
    );
};

export default ExportComponent;
