import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'

const TrainingNames = () => {
    const [trainingNames, setTrainingNames] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}api/admin/trainingNames`);
                setTrainingNames(response.data.data[0]);

            } catch (error) {
                console.error('Error fetching training names:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (event, name) => {
        const { value } = event.target;
        setTrainingNames(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authtoken");
            const url = `${API_URL}api/admin/trainingNames`
            const response = await axios.post(url, trainingNames, {
                headers: {
                    "auth-token": token
                }
            });
            if(response.data.success){
                toast.success("Names updated successfully")
            }else{
                toast.error(response.data.message)
            }
           
            // You may want to handle success feedback here
        } catch (error) {
            console.error('Error updating names:', error);
            toast.error('Error updating names')
            // You may want to handle error feedback here
        } finally {
            setLoading(false);
        }
    };

    if (loading || !trainingNames) {
        return <CircularProgress />;
    }

    return (
        <Container
            sx={{ marginX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
            <Typography variant="h5" gutterBottom>
                Training Names 
            </Typography>
            <TextField
                fullWidth
                label={`Number of Trainings`}
                name={"Training_No"}
                value={trainingNames["Training_No"]}
                onChange={e => handleChange(e, "Training_No")}
                variant="outlined"
                margin="normal"
                disabled={loading}
            />
            {[1, 2, 3, 4].map((number, index) => (
                <TextField
                    key={index}
                    fullWidth
                    label={`Training ${number} Name`}
                    name={`Training${number}_name`}
                    value={trainingNames[`Training${number}_name`]}
                    onChange={e => handleChange(e, `Training${number}_name`)}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                />
            ))}
            <TextField
                fullWidth
                label={"Placement Name"}
                name={"Placement_name"}
                value={trainingNames["Placement_name"]}
                onChange={e => handleChange(e, "Placement_name")}
                variant="outlined"
                margin="normal"
                disabled={loading}
            />
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ marginTop: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <ToastContainer />
        </Container>

    );
};

export default TrainingNames;
