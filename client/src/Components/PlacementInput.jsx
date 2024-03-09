import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FileBase from 'react-file-base64';
import Grid from '@mui/material/Grid';
import { openBase64NewTab } from '../CommonComponent/base64topdf';
import EditIcon from '@mui/icons-material/Edit';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'

export default function PlacementForm() {
  const [formData, setFormData] = useState({
    company: '',
    placementType: '',
    highStudy: '',
    appointmentNo: '',
    appointmentLetter: null,
    package: '',
  });
  const [isPlaced, setIsPlaced] = useState(false);
  const [isHighstudy, setHighstudy] = useState(false);
  const decodeAuthToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const urn = decodedToken.urn;
      return urn;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };
  const token = localStorage.getItem("authtoken");
  const urn = decodeAuthToken(token);
  const [errors, setErrors] = useState({});
  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isLock, setIsLock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${API_URL}placement/${urn}`;
        const response = await axios.get(url);
        const userData = response.data.data;
        console.log(userData)

        // Check if all fields are filled in the fetched data
        if ( userData.isPlaced !== null && userData.highStudy !== null) {
          // If all required fields are present, populate the form data
          setFormData(userData);
          setIsEditing(false);
          console.log(1);
          console.log(isEditing);
          setIsPlaced(userData.isPlaced);
          setHighstudy(userData.highStudy);
          if (userData.lock) {
            setIsLock(true);
          } else {
            setIsLock(false);
          }
        } else {
          console.error('Error: Fetched data is incomplete.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleFileChange = (files) => {
    setFormData({ ...formData, appointmentLetter: files.base64 });
    setAppointmentLetter(files.base64);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Dynamic regex and validation check messages
    let regex;
    let errorMsg;
    switch (name) {
      case 'contact':
        regex = /^\d{10}$/;
        errorMsg = 'Contact must be 10 digits';
        break;
      case 'crn':
        regex = /^\d{7}$/;
        errorMsg = 'CRN must be a 7-digit number';
        break;
      default:
        break;
    }
    if (regex && !regex.test(value)) {
      setErrors({ ...errors, [name]: errorMsg });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Form validation
      const formErrors = {};
      if (!formData.company.trim()) {
        formErrors.company = 'Company name cannot be blank';
      }
    

      // Prepare form data to be submitted
      let submitData = {};
      console.log(formData)
      if (isPlaced) {
        // Include form data as is if isPlaced is true
        submitData = { ...formData, isPlaced: true };
      } else {
        // Include isPlaced as false and set other fields to null if isPlaced is false
        submitData = { company: null, placementType: null, highStudy: formData.highStudy, appointmentNo: null, appointmentLetter: null, package: null, isPlaced: false };
      }
      console.log(submitData)
      // Submit form data
      const response = await axios.post(`${API_URL}placement`, {
        formData: submitData,
        urn: urn,
      });

      if (response.data.success) {
        toast.success('Placement details submitted successfully!');
        setIsSubmitting(false);
        setIsEditing(false);
      } else {
        toast.error('Failed to submit placement details. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the placement details.');
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleViewCertificate = () => {
    if (appointmentLetter) {
      openBase64NewTab(appointmentLetter);
    } else {
      openBase64NewTab(formData.appointmentLetter);
    }
  };

  const handleIsPlacedChange = (e) => {
    const { name, value } = e.target;
    setIsPlaced(value === "true");
    console.log(name,value)
    setFormData({ ...formData, [name]: value });
  };
  const handleIsHighChange = (e) => {
    console.log(e.target)
    const { name, value } = e.target;
    setHighstudy(value === "Yes");
  
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>

      <Container style={{ paddingInline: 0, paddingBottom: 50 }} >
        {!isLock && (
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            style={{
              position: 'relative',
              float: 'left',
            }}
          >

            <EditIcon />
          </Button>
        )}
        {isEditing && !isLock && (
          <Button
            type="submit"
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={isSubmitting}
            style={{
              position: 'relative',
              float: 'right',
            }}
          >
            Submit
          </Button>
        )}
      </Container>
      <Typography variant="h5" gutterBottom>
        Please fill in your placement details below.
      </Typography>
      
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Have you been placed?"
          variant="outlined"
          fullWidth
          required
          name="isPlaced"
          value={isPlaced ? "true" : "false"}
          onChange={handleIsPlacedChange}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>

        <TextField
          select
          label="Will you pursue higher studies?"
          variant="outlined"
          fullWidth
          required
          name="highStudy"
          value={isHighstudy ? "Yes" : "No"}
          onChange={handleIsHighChange}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>

      </Grid>

      {isPlaced && (
        <>
          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            required
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={!!errors.company}
            helperText={errors.company}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          />

          <TextField
            label="Appointment Number"
            variant="outlined"
            fullWidth
            required
            name="appointmentNo"
            type="number"
            value={formData.appointmentNo}
            onChange={handleChange}
            error={!!errors.appointmentNo}
            helperText={errors.appointmentNo}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          />

          <Grid item xs={12} container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom textAlign="left" marginTop={2}>
              Upload Appointment Letter
            </Typography>
            <FileBase
              type="file"
              multiple={false}
              onDone={handleFileChange}
              disabled={!isEditing || isSubmitting}
            />
          </Grid>

          <TextField
            label="Package"
            variant="outlined"
            fullWidth
            required
            name="package"
            value={formData.package}
            onChange={handleChange}
            error={!!errors.package}
            helperText={errors.package}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          />

          <TextField
            select
            label="Placement Type"
            variant="outlined"
            fullWidth
            required
            name="placementType"
            value={formData.placementType}
            onChange={handleChange}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          >
            <MenuItem value="On Campus">On Campus</MenuItem>
            <MenuItem value="Off Campus">Off Campus</MenuItem>
          </TextField>

          {!isEditing && (
            <Button onClick={handleViewCertificate} variant="outlined" color="primary">
              View Appointment Letter
            </Button>
          )}
        </>
      )}


      <ToastContainer />
    </Container>
  );
}
