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
import FileBase from 'react-file-base64';
import Grid from '@mui/material/Grid';
import {  openBase64NewTab } from '../CommonComponent/base64topdf';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';  
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jwtDecode } from "jwt-decode";

export default function PlacementForm() {
  const [formData, setFormData] = useState({
    company: '',
    appointmentDate: '',
    appointmentLetter: null,
    package: '',
  });
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

  useEffect(() => {
    // Fetch data from the database when the component mounts or the page is refreshed
    const fetchData = async () => {
      try {
        const url = `http://localhost:8000/placement/${urn}`;
        const response = await axios.get(url);
        const userData = response.data.data;
        console.log(userData);

       

        // Check if all fields are filled in the fetched data
        if (
          userData.company &&
          userData.appointmentDate &&
          userData.appointmentLetter &&
          userData.package
        ) {
          // If all fields are filled, populate the form data and disable editing
          setFormData(userData);
          console.log(userData.appointmentDate);
          setIsEditing(false);
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

  const handleDateChange = (newDate) => {
    // Extract year, month, and day from the selected date
    const year = newDate.$y;
    const month = newDate.$M + 1; // Months start from 0, so add 1
    const day = newDate.$D;
  
    // Format the date string
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
    console.log(formattedDate);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation
      const formErrors = {};
      if (!formData.company.trim()) {
        formErrors.company = 'Company name cannot be blank';
      }
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      const response = await axios.post('http://localhost:8000/placement', {
        formData,
        urn: urn,
      });
      console.log("response", response);
      if (response.data.success) {
        toast.success('Placement details submitted successfully!');
        // //Clear form data after successful submission
        // setFormData({
        //   company: '',
        //   appointmentDate: '',
        //   appointmentLetter: '',
        //   package: '',
        // });
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
    if(appointmentLetter){
      openBase64NewTab(appointmentLetter);}
    else{
      openBase64NewTab(formData.appointmentLetter);
    }
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
      <Button
        onClick={handleEdit}
        color="primary"
        variant="contained"
        style={{
          position: 'relative',

          marginLeft: '10px',
          float: 'right',
          // Adjust the margin as needed
        }}
      >
        Edit
        <EditIcon />
      </Button>
      <Typography variant="h5" gutterBottom>
        Please fill in your placement details below.
      </Typography>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* Company */}
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
        {/* Appointment Date */}
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker
            label="Appointment Date"
            views={['year', 'month', 'day']}
            renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
          {/* <TextField
            label="Appointment Date"
            variant="outlined"
            fullWidth
            required
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            error={!!errors.appointmentDate}
            helperText={errors.appointmentDate}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          /> */}
        {/* Appointment Letter */}

        

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


        {/* Package */}
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

        {/* View Certificate Button */}
        {!isEditing && (
          <Button onClick={handleViewCertificate} variant="outlined" color="primary">
            View Appointment Letter
          </Button>
        )}

        {isEditing && (
          <Button
            type="submit"
            color="primary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={isSubmitting}
          >
            Submit Placement Details
          </Button>
        )}
        
      </form>
    </Container>
  );
}
