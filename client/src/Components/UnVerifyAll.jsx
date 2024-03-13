import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/';

const UnVerifyAllComponent = ({ selectedTraining , onRefresh, refresh}) => {
    const [open, setOpen] = useState(false);
    

    const handleUnVerifyAll = async () => {
        setOpen(true);
    };

    const handleConfirmUnVerifyAll = async () => {
        try {
            const token = localStorage.getItem('authtoken');
            let url = '';

            if (selectedTraining === 'placementData') {
                url = `${API_URL}placement/unverifyall`;
            } else if (selectedTraining) {
                // Use the appropriate training number in the URL
                const trainingNumber = selectedTraining.substring(2);
                url = `${API_URL}tr${trainingNumber}/unverifyall`;
            } else {
                console.error('Selected training is not valid.');
                return;
            }

            // Send a POST request to the backend API endpoint
            const response = await axios.post(url, {}, {
                headers: {
                    'auth-token': token
                }
            });

            if (response.data.success) {
                toast.success('All users unverified successfully!');
                onRefresh();
            } else {
                toast.error('Failed to unverify all users.');
            }
        } catch (error) {
            console.error('Error unVerifying all users:', error);
            toast.error('Error unVerifying all users.');
        } finally {
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button onClick={handleUnVerifyAll} variant="contained" color="primary">
                UnVerify All
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to UnVerify all users?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmUnVerifyAll} color="primary">
                        Yes
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UnVerifyAllComponent;
