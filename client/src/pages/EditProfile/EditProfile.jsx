import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress, Typography } from '@mui/material';
// API_URL should point to your backend API endpoint
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL

const EditProfile = () => {
    // State variables
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [formData, setFormData] = useState({}); // Stores original fetched data

    const [loading, setLoading] = useState(false); // Indicates loading state
    const [fetchError, setFetchError] = useState(false); // Indicates if there's an error fetching data
    const [isEditing, setIsEditing] = useState(false);
    const [crnError, setCrnError] = useState(false); // Indicates if there's an error with the CRN input
    const [crn, setCrn] = useState(''); // Stores the entered CRN
    const [isChanged, setIsChanged] = useState(false)

    // Function to fetch data for a given CRN from the backend
    const fetchData = async () => {
        if (crn.length !== 7) {
            setCrnError(true); // Set CRN error if it's not 7 digits
            return;
        }
        setLoading(true); // Set loading state to true
        setFetchError(false); // Reset fetch error state
        try {
            const token = localStorage.getItem('authtoken');
            // Make GET request to fetch data for the given CRN
            const response = await axios.get(`${API_URL}userprofiles/${crn}`, {
                headers: { 'auth-token': token },
            });

            const data = response.data.data;
            if (data) {
                setFormData(data);
                setShowModal(true); // Store fetched data in state
                setFetchError(false); // Reset fetch error state
            } else {
                setFetchError(true);
                setShowModal(true);// Set fetch error state if no data found
            }
        } catch (error) {

            console.error('Error fetching data:', error);
            setFetchError(true);
            setShowModal(true); // Set fetch error state in case of error
        } finally {
            setLoading(false); // Set loading state to false after data is fetched
        }
    };

    // Function to handle edit button click
    const handleEdit = () => {
        // Enable editing mode
        setIsEditing((prevEditing) => !prevEditing);

        // You can implement this functionality based on your requirements
    };

    // Function to handle form field changes
    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsChanged(true)
        // Update the formData state directly
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    // Function to handle submit button click
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setFetchError(false)
            setIsEditing(false)
            setIsChanged(false)
            const token = localStorage.getItem('authtoken');
            // Make PUT request to update data with editedData
            const response = await axios.post(
                `${API_URL}userprofiles`,
                { formData, crn: crn },
                {
                    headers: { 'auth-token': token },
                }
            );
            if (response.data.success) {
                setLoading(false);
                setShowModal(false);
                toast('Succesfully edited data');

            } else {
                toast(json.message);
                setLoading(false);
                setShowModal(false);
            }

            // Close the modal after data is submitted successfully
        } catch (error) {
            console.error('Error submitting data:', error);
            toast("Failed to edit data");
            setLoading(false); // Set loading state to false in case of error
        }
    };

    return (
        <Container style={{ marginTop: '100px' }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexDirection: 'column' }}>
                    {/* Input field to enter CRN */}
                    <TextField
                        id="crnInput"
                        label="CRN"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        fullWidth
                        error={crnError}
                        value={crn}
                        onChange={(e) => {
                            if (e.target.value.length === 7) {
                                setCrnError(false);
                            } else {
                                setCrnError(true);
                            }
                            setCrn(e.target.value);
                        }}
                    />
                    {/* Button to trigger fetching data */}
                    <Button variant="contained" onClick={fetchData} disabled={loading}>
                        {loading ? <CircularProgress color='inherit' size={24}/> :
                            <Typography>Fetch Data</Typography>}
                    </Button>
                </Grid>
            </Grid>

            {/* Modal to display fetched data and edit form */}
            <Modal open={showModal} onClose={() => setShowModal(false)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Box sx={{ width: '700px', p: 4, bgcolor: 'background.paper', borderRadius: 2, maxHeight: '80vh', overflowY: 'auto',  }}>
                    {/* Loading indicator while data is being fetched */}
                    {/* {loading && <LinearProgress />} */}
                    {/* Check if there's an error fetching data */}
                    {fetchError ? (
                        <Box sx={{ mb: 2, display: "flex", justifyContent: 'center', flexDirection: 'column' }}>
                            <p>No data found for the provided CRN.</p>

                            <Button variant="contained" onClick={() => setShowModal(false)} sx={{ mr: 2, mb: 2 }}>
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <>

                            <Box 
                            sx={{ display: 'flex', justifyContent: "space-between", position: 'relative', height: '50px', bgcolor: 'background.paper' }} >
                                <div style={{ display: 'flex' }}>
                                    <Button     
                                    disabled={loading}
                                    variant="contained" onClick={handleEdit} sx={{ mr: 2 , mb: 2 }}>
                                        Edit
                                    </Button>
                                    <Button 
                                    disabled={loading}
                                    variant="text" onClick={() => {
                                    setShowModal(false) 
                                    setIsChanged(false)
                                    setIsEditing(false)
                                    }} sx={{ mr: 4, mb: 2 }}>
                                        Cancel
                                    </Button>
                                </div>
                                <Button 
                                disabled={loading || !isChanged}
                                variant="contained" onClick={handleSubmit} sx={{ mb: 2 }}>
                                    {loading ? <CircularProgress size={24} color='inherit'/> : 'Submit'}
                                </Button>
                            </Box>
                            <Box sx={{marginTop: '10px'}}>
                                <hr/>
                                {/* Text fields to display and edit fetched data */}
                                <TextField
                                    label="University Roll Number"
                                    variant="outlined"
                                    sx={{ mb: 2, marginTop:'20px' }}
                                    fullWidth
                                    placeholder='1234567'
                                    name="urn"
                                    value={formData.urn}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Name"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Mother's Name"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    placeholder='Mother’s Name'
                                    name="mother"
                                    value={formData.mother}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Father's Name"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    placeholder='Father’s Name'
                                    name="father"
                                    value={formData.father}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Personal Mail"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    placeholder='example@gmail.com'
                                    name="personalMail"
                                    value={formData.personalMail}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    label="Contact"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    placeholder='9876543210'
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                                <TextField
                                    select
                                    label="Section"
                                    variant="outlined"
                                    fullWidth
                                    name="section"
                                    value={formData.section}
                                    sx={{
                                        mb: 2,
                                        '& .MuiSelect-select': { textAlign: 'left' } // Aligns the selected value to the left
                                    }}
                                    disabled={!isEditing}
                                >
                                    <MenuItem value="A1" >A1</MenuItem>
                                    <MenuItem value="A2">A2</MenuItem>
                                    <MenuItem value="B1">B1</MenuItem>
                                    <MenuItem value="B2">B2</MenuItem>
                                    <MenuItem value="C1">C1</MenuItem>
                                    <MenuItem value="C2">C2</MenuItem>
                                    <MenuItem value="D1">D1</MenuItem>
                                    <MenuItem value="D2">D2</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    label="Branch"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                ><MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                                </TextField>
                                <TextField
                                    label="Mentor's Name"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    required
                                    name="mentor"
                                    placeholder='Your Mentor Name'
                                    value={formData.mentor}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <TextField
                                    select
                                    label="Gender"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    required
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    label="Admission Type"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    name="admissionType"
                                    value={formData.admissionType}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <MenuItem value="Non LEET">Non LEET</MenuItem>
                                    <MenuItem value="LEET">LEET</MenuItem>
                                </TextField>
                            </Box>

                        </>
                    )}
                </Box>
            </Modal>
            <ToastContainer />
        </Container>
    );
};

export default EditProfile;
