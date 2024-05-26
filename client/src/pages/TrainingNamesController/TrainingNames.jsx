import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL

const TrainingNames = () => {
    const [trainingNames, setTrainingNames] = useState(null);
    const [loading, setLoading] = useState(false);
    const [trainingCount, setTrainingCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}admin/trainingNames`);
                setTrainingNames(response.data.data[0]);
                setTrainingCount(response.data.data[0]["Training_No"]);

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
        if (name === "Training_No") {
            setTrainingCount(parseInt(value));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authtoken");
            const url = `${API_URL}admin/trainingNames`
            const response = await axios.post(url, trainingNames, {
                headers: {
                    "auth-token": token
                }
            });
            if (response.data.success) {
                toast.success("Names updated successfully")
            } else {
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
            sx={{ marginX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: "100px" }}>
            <Typography variant="h5" gutterBottom>
                Training Names
            </Typography>
            <TextField InputLabelProps={{ shrink: true }}
                fullWidth
                label={`Number of Trainings`}
                name={"Training_No"}
                value={trainingNames["Training_No"]}
                onChange={e => handleChange(e, "Training_No")}
                variant="outlined"
                margin="normal"
                disabled={loading}
            />
            {trainingCount > 0 && (
                [...Array(trainingCount).keys()].map((number, index) => (
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        key={index}
                        fullWidth
                        label={`Training ${number + 1} Name`}
                        name={`Training${number + 1}_name`}
                        value={trainingNames[`Training${number + 1}_name`]}
                        onChange={e => handleChange(e, `Training${number + 1}_name`)}
                        variant="outlined"
                        margin="normal"
                        disabled={loading}
                    />
                ))
            )}

            <TextField
                InputLabelProps={{ shrink: true }}
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
