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
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// API_URL should point to your backend API endpoint
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL

const EditProfile = () => {
    // State variables
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [formData, setFormData] = useState({}); // Stores original fetched data
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Indicates loading state
    const [fetchError, setFetchError] = useState(false); // Indicates if there's an error fetching data
    const [isEditing, setIsEditing] = useState(false);
    const [crnError, setCrnError] = useState(false); // Indicates if there's an error with the CRN input
    const [crn, setCrn] = useState(''); // Stores the entered CRN
    const [isChanged, setIsChanged] = useState(false)
    const [showModal2, setShowModal2] = useState(false);
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    const handlePassword = () => {
        if (! /^\d{7}$|^Tr\d{3}$/.test(crn)) {
            toast.error("Invalid CRN ")
            setCrnError(true); // Set CRN error if it's not 7 digits
            return;
        }
        
        Data();
        setShowModal2(true);
    }
    // Function to fetch data for a given CRN from the backend
    const fetchData =  async() => {
        if (/^Tr\d{3}$/.test(crn)) {
            toast.error("Admin Can Only Change Own Password")
            setCrnError(true); // Set CRN error if it's not 7 digits
            return;
        }
        else if (! /^\d{7}$/.test(crn)) {
            toast.error("Invalid CRN ")
            setCrnError(true); // Set CRN error if it's not 7 digits
            return;
        }
        
        setLoading(true); // Set loading state to true
        setFetchError(false); // Reset fetch error state
        await Data();
        setShowModal(true); 
       
    };
    const Data = async () => {
        try {
            const token = localStorage.getItem('authtoken');
            // Make GET request to fetch data for the given CRN
            const response = await axios.get(`${API_URL}userprofiles/${crn}`, {
                headers: { 'auth-token': token },
            });

            const data = response.data.data;
            if (data) {
                setFormData(data);
                // Store fetched data in state
                setFetchError(false); // Reset fetch error state
                setLoading(false)
            } else {
                setFetchError(true);
                // Set fetch error state if no data found
                setLoading(false)
            }
        } catch (error) {

            console.error('Error fetching data:', error);
            setFetchError(true);
            setLoading(false)
          // Set fetch error state in case of error
        } finally {
            setLoading(false); // Set loading state to false after data is fetched
        }
    }
   const hanldeChangePassword=async()=>{
       try {
           const validationErrors = Object.keys(formData).reduce((acc, key) => {
               const error = validateField(key, formData[key]);
               return error ? { ...acc, [key]: error } : acc;
           }, {});

           if (Object.keys(validationErrors).length > 0) {
               setErrors(validationErrors);
               toast.error("Password doesn't match")
               setLoading(false);
               return;
           }
           setLoading(true);
           setFetchError(false)
           setIsEditing(false)
           setIsChanged(false)
           const token = localStorage.getItem('authtoken');
           // Make PUT request to update data with editedData
           const response = await fetch(`${API_URL}password/updatepassword`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' , "auth-token": token}, 
               body: JSON.stringify({
                   crn:crn,
                   password: formData.password
               }),

           });
           console.log(response)
           if (response.ok) {
               setLoading(false);
               setShowModal2(false);
               toast('Succesfully edited data');
               setFormData({})
               setErrors({
                   password: '',
                   confirmPassword: '',
               })

           } else {
               toast(json.message);
               setLoading(false);
               setShowModal2(false);
           }

           // Close the modal after data is submitted successfully
       } catch (error) {
           console.error('Error submitting data:', error);
           toast("Failed to edit data");
           setLoading(false); // Set loading state to false in case of error
       }
   };
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'password':
                return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
            case 'confirmPassword':
                return value === formData.password ? '' : 'Passwords do not match';
            default:
                return '';
        }
    };
    // Function to handle edit button click
   

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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));

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
                            <Typography>Change User Info</Typography>}
                    </Button>
                    <Button variant="contained" onClick={handlePassword} disabled={loading}>
                            <Typography>Change Password</Typography>
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
                                    InputLabelProps={{shrink:true}}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Personal Mail"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    placeholder='example@gndec.ac.in'
                                    name="personalMail"
                                    value={formData.personalMail}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="Non LEET">Non LEET</MenuItem>
                                    <MenuItem value="LEET">LEET</MenuItem>
                                </TextField>
                                      
                            </Box>

                        </>
                    )}
                </Box>
            </Modal>
            <Modal open={showModal2} onClose={() => setShowModal2(false)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Box sx={{ width: '700px', p: 4, bgcolor: 'background.paper', borderRadius: 2, maxHeight: '80vh', overflowY: 'auto', }}>
                    {/* Loading indicator while data is being fetched */}
                    {/* {loading && <LinearProgress />} */}
                    {/* Check if there's an error fetching data */}
                    {fetchError ? (
                        <Box sx={{ mb: 2, display: "flex", justifyContent: 'center', flexDirection: 'column' }}>
                            <p>No data found for the provided CRN.</p>

                            <Button variant="contained" onClick={() => setShowModal2(false)} sx={{ mr: 2, mb: 2 }}>
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
                                        variant="contained" onClick={handleEdit} sx={{ mr: 2, mb: 2 }}>
                                        Edit
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        variant="text" onClick={() => {
                                            setShowModal2(false)
                                            setIsChanged(false)
                                            setIsEditing(false)
                                        }} sx={{ mr: 4, mb: 2 }}>
                                        Cancel
                                    </Button>
                                </div>
                                <Button
                                    disabled={loading || !isChanged}
                                    variant="contained" onClick={hanldeChangePassword} sx={{ mb: 2 }}>
                                    {loading ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
                                </Button>
                            </Box>
                            <Box sx={{ marginTop: '10px' }}>
                                <hr />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Set New Password"
                                    value={formData.password}
                                    type={showPassword ? 'text' : 'password'} // Show password text if showPassword is true
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                        InputLabelProps={{ shrink: true }}
                            helperText={errors.password}
                            error={Boolean(errors.password)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    disabled={!isEditing}
                                                >
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            type="password"
                            onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                            disabled={!isEditing}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                        />
                                      
                               
                            </Box>

                            </>
                                )
                            }
                </Box>
            </Modal>
            <ToastContainer />
        </Container>
    );
};

export default EditProfile;
