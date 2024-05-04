import React from 'react';
import { Button, Box } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { base64toBlob } from '../utils/base64topdf'
const ExportCsvComponent = ({ data, selectedTraining }) => {
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportData = () => {
        const filteredData = data.map(row => {
            const filteredRow = {};
            filteredRow['Name'] = row.userInfo.Name;
            filteredRow['College Email'] = row.email;
            filteredRow['University Roll Number'] = row.userInfo.urn;
            filteredRow['College Roll Number'] = row.crn;
            filteredRow['Gender'] = row.userInfo.gender;
            filteredRow['Mentor Name'] = row.userInfo.mentor;
            filteredRow['Batch'] = row.userInfo.batch;
            filteredRow['Section'] = row.userInfo.section;
            filteredRow["Mother's Name"] = row.userInfo.mother;
            filteredRow["Father's Name"] = row.userInfo.father;
            filteredRow['Contact Number'] = row.userInfo.contact;
            filteredRow['Admission Type'] = row.userInfo.admissionType;
            filteredRow['Personal Email'] = row.userInfo.personalMail;
            if (selectedTraining && selectedTraining !== "placementData") {
                if (row[selectedTraining]) {
                    const trainingData = row[selectedTraining];
                    filteredRow['Training Type'] = trainingData.type;
                    filteredRow['Organization Name'] = trainingData.organization;
                    filteredRow['Project Name'] = trainingData.projectName;
                    filteredRow['Technology Used'] = trainingData.technology.join(', ');
                    if (trainingData.certificate) {
                        const certifiateBlob = base64toBlob(trainingData.certificate);
                        const certificateUrl = URL.createObjectURL(certifiateBlob);
                        filteredRow['Training Certificate'] = certificateUrl;
                    } else {
                        filteredRow['Training Certificate'] = '';
                    }
                } else {
                    return {};
                }
            } else if (selectedTraining && selectedTraining === "placementData") {
                if (row[selectedTraining]) {
                    const trainingData = row[selectedTraining];
                    filteredRow['Placed Status'] = trainingData.isPlaced;
                    filteredRow['Company'] = trainingData.company;
                    filteredRow['Placement Type'] = trainingData.placementType;
                    filteredRow['Appointment Number'] = trainingData.appointmentNo;
                    filteredRow['Package'] = trainingData.package;
                    filteredRow['Appointment Date'] = trainingData.appointmentDate;
                    filteredRow['Designation'] = trainingData.designation;

                    // Convert appointment letter to data URL
                    if (trainingData.appointmentLetter) {
                        const appointmentLetterBlob = base64toBlob(trainingData.appointmentLetter);
                        filteredRow['Appointment Letter'] = URL.createObjectURL(appointmentLetterBlob);

                    } else {
                        filteredRow['Appointment Letter'] = '';
                    }
                    filteredRow['Higher Study Status'] = trainingData.highStudy;
                    filteredRow['Higher Study Place'] = trainingData.highStudyplace;
                    filteredRow['Gate Appeared Status'] = trainingData.gateStatus;
                    if (trainingData.gateCertificate) {
                        const gateCertificateBlob = base64toBlob(trainingData.gateCertificate);
                        filteredRow['Gate Admit Card/ ScoreCard'] = URL.createObjectURL(gateCertificateBlob);

                    } else {
                        filteredRow['Gate Admit Card/ ScoreCard'] = '';
                    }
                } else {
                    return {};
                }
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
                Export Data in Csv
            </Button>
        </Box>
    );
};

export default ExportCsvComponent;