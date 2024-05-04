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
                    maxWidth: 800,
                    minWidth: 400,
                    maxHeight:500,
                    overflowY:"auto"
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Placement Details
                </Typography>
                <hr/>
                <Typography variant="body1" gutterBottom>
                    <strong>Placement Status:</strong> {data.isPlaced ? 'Yes' : 'No'}
                </Typography>
                {data.isPlaced === true && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            <strong>Company:</strong>  {data.company}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Placement Type:</strong>  {data.placementType}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Appointment No:</strong>   {data.appointmentNo}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Appointment Date:</strong> {data.appointmentDate}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Designation:</strong> {data.designation}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Package:</strong> {data.package}
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            <strong>Appointment Letter: &nbsp;</strong> <a onClick={() => handleViewCertificate(data.appointmentLetter)} style={{ cursor: 'pointer', textDecoration: 'underline', color:'#900000'}} >
                                View
                            </a>
                        </Typography>
                    </>
                )}

                <Typography variant="body1" gutterBottom>
                    <strong>Higher Study:</strong> {data.highStudy ?"Yes" : "No"}
                </Typography>
                {data.highStudy  && (
                    <Typography variant="body1" gutterBottom>
                        <strong> Higher Study Preference:</strong> {data.highStudyplace}
                    </Typography>
                )}

                <Typography variant="body1" gutterBottom>
                    <strong>Gate Status:</strong> {data.gateStatus ? "Yes":"No"}
                </Typography>
                {data.gateStatus && (
                    <>
                        <Typography variant="body1" gutterBottom>
                           
                            <strong>Gate Admit Card/Scorecard: &nbsp;</strong>  <a onClick={() => handleViewCertificate(data.gateCertificate)} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#900000' }} >
                                View
                            </a>
                        </Typography>
                    </>
                )}
                <Alert severity="info" sx={{ marginTop: 2 }}>
                    This information is stored officially
                </Alert>
                <hr/>
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
