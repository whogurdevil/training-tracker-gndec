import React from 'react';
import { Button, Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { base64toBlob } from '../utils/base64topdf';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const ExportExcelComponent = ({ data, selectedTraining }) => {
    const handleExportData = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Training Data');

        // Define column headers
        const columns = [
            { header: 'Name', key: 'Name' },
            { header: 'College Email', key: 'CollegeEmail' },
            { header: 'University Roll Number', key: 'UniversityRollNumber' },
            { header: 'College Roll Number', key: 'CollegeRollNumber' },
            { header: 'Gender', key: 'Gender' },
            { header: 'Mentor Name', key: 'MentorName' },
            { header: 'Batch', key: 'Batch' },
            { header: 'Section', key: 'Section' },
            { header: "Mother's Name", key: 'MotherName' },
            { header: "Father's Name", key: 'FatherName' },
            { header: 'Contact Number', key: 'ContactNumber' },
            { header: 'Admission Type', key: 'AdmissionType' },
            { header: 'Personal Email', key: 'PersonalEmail' },
        ];
        if (selectedTraining) {
            if (selectedTraining !== "placementData") {
                columns.push(
                    { header: 'Training Type', key: 'TrainingType' },
                    { header: 'Organization Name', key: 'OrganizationName' },
                    { header: 'Project Name', key: 'ProjectName' },
                    { header: 'Technology Used', key: 'TechnologyUsed' },
                    { header: 'Training Certificate', key: 'TrainingCertificate' }
                );
            } else {
                columns.push(
                    { header: 'Placed Status', key: 'PlacedStatus' },
                    { header: 'Company', key: 'Company' },
                    { header: 'Placement Type', key: 'PlacementType' },
                    { header: 'Appointment Number', key: 'AppointmentNumber' },
                    { header: 'Package', key: 'Package' },
                    { header: 'Appointment Date', key: 'AppointmentDate' },
                    { header: 'Designation', key: 'Designation' },
                    { header: 'Gate Admit Card/ ScoreCard', key: 'GateAdmitCard' },
                    { header: 'Higher Study Status', key: 'HigherStudyStatus' },
                    { header: 'Higher Study Place', key: 'HigherStudyPlace' },
                    { header: 'Gate Appeared Status', key: 'GateAppearedStatus' }
                );
            }
        }
            sheet.columns = columns;
        // Populate data rows
            data.forEach(row => {
                const rowData = {
                    Name: row.userInfo.Name,
                    CollegeEmail: row.email,
                    UniversityRollNumber: row.userInfo.urn,
                    CollegeRollNumber: row.crn,
                    Gender: row.userInfo.gender,
                    MentorName: row.userInfo.mentor,
                    Batch: row.userInfo.batch,
                    Section: row.userInfo.section,
                    MotherName: row.userInfo.mother,
                    FatherName: row.userInfo.father,
                    ContactNumber: row.userInfo.contact,
                    AdmissionType: row.userInfo.admissionType,
                    PersonalEmail: row.userInfo.personalMail
                };

                // Add training-specific data based on selectedTraining
                if (selectedTraining && row[selectedTraining]) {
                    const trainingData = row[selectedTraining];
                    if (selectedTraining !== "placementData") {
                        rowData['TrainingType'] = trainingData.type;
                        rowData['OrganizationName'] = trainingData.organization;
                        rowData['ProjectName'] = trainingData.projectName;
                        rowData['TechnologyUsed'] = trainingData.technology.join(', ');

                        if (trainingData.certificate) {
                            const certificateBlob = base64toBlob(trainingData.certificate);
                            const certificateUrl = URL.createObjectURL(certificateBlob);
                            rowData['TrainingCertificate'] = {
                                text: 'View Certificate',
                                hyperlink: certificateUrl,
                                tooltip: 'Click to view certificate'
                            };
                        }
                    } else {
                        rowData['PlacedStatus'] = trainingData.isPlaced;
                        rowData['Company'] = trainingData.company;
                        rowData['PlacementType'] = trainingData.placementType;
                        rowData['AppointmentNumber'] = trainingData.appointmentNo;
                        rowData['Package'] = trainingData.package;
                        rowData['AppointmentDate'] = trainingData.appointmentDate;
                        rowData['Designation'] = trainingData.designation;

                        if (trainingData.appointmentLetter) {
                            const appointmentLetterBlob = base64toBlob(trainingData.appointmentLetter);
                            const certificateUrl = URL.createObjectURL(appointmentLetterBlob);
                            rowData['GateAdmitCard'] = {
                                text: 'View Certificate',
                                hyperlink: certificateUrl,
                                tooltip: 'Click to view certificate'
                            };
                        }
                        rowData['HigherStudyStatus'] = trainingData.highStudy;
                        rowData['HigherStudyPlace'] = trainingData.highStudyplace;
                        rowData['GateAppearedStatus'] = trainingData.gateStatus;
                    }
                }

                sheet.addRow(rowData);
        });

        // Generate Excel file and download
        const buffer = await workbook.xlsx.writeBuffer();
        const excelBlob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
        saveAs(excelBlob, 'training_data.xlsx');
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
                Export Data in Excel
            </Button>
        </Box>
    );
};

export default ExportExcelComponent;
