import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { base64toBlob, openBase64NewTab } from '../utils/base64topdf';

const PlacementModal = ({ placementData, showModal, onClose }) => {
    const data = placementData.placementData;
    const handleViewCertificate = (certificate) => {
        if (certificate) {
            openBase64NewTab(certificate);
        }
        else {
            openBase64NewTab(formData.certificate);
        }
    };
    return (

        <Modal open={showModal} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5,
                    maxWidth: 600,
                }}
            >
                {console.log(data)}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Placement Details
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Placement Status: {data.isPlaced ? 'Yes' : 'No'}
                </Typography>
                {data.isPlaced === true && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Company: {data.company}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Placement Type: {data.placementType}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Appointment No: {data.appointmentNo}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Appointment Date: {data.appointmentDate}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Designation: {data.designation}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Package: {data.package}
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            Appointment Letter: <Button onClick={() => handleViewCertificate(data.appointmentLetter)} variant="outlined" color="primary" >
                                View
                            </Button>
                        </Typography>
                    </>
                )}

                <Typography variant="body1" gutterBottom>
                    High Study: {data.highStudy}
                    {console.log(data.highStudy)}
                </Typography>
                {data.highStudy === "Yes" && (
                    <Typography variant="body1" gutterBottom>
                        High Study Place: {data.highStudyplace}
                    </Typography>
                )}

                <Typography variant="body1" gutterBottom>
                    Gate Status: {data.gateStatus}
                </Typography>
                {data.gateStatus === "Yes" && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Gate Admit Card/Scorecard: <Button onClick={() => handleViewCertificate(data.gateCertificate)} variant="outlined" color="primary" >
                                View
                            </Button>
                        </Typography>
                    </>
                )}
                <Alert severity="info" sx={{ marginTop: 2 }}>
                    This information is stored officially
                </Alert>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button variant="contained" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default PlacementModal;
