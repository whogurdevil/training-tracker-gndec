import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function PlacementForm() {
  const [formData, setFormData] = useState({
    company: '',
    appointmentDate: '',
    appointmentLetter: '',
    package: '',
  });
  const location = useLocation();
  const urn = location.state && location.state.urn;
  const [errors, setErrors] = useState({});

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
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      const response = await axios.post('http://localhost:8000/placement', {
        formData,
        urn: urn,
      });
      console.log(response);
      if (response.data.success) {
        toast.success('Placement details submitted successfully!');
        // Clear form data after successful submission
        setFormData({
          company: '',
          appointmentDate: '',
          appointmentLetter: '',
          package: '',
        });
      } else {
        toast.error('Failed to submit placement details. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the placement details.');
    }
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
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
        />
        {/* Appointment Date */}
        <TextField
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
        />
        {/* Appointment Letter */}
        <TextField
          label="Appointment Letter"
          variant="outlined"
          fullWidth
          required
          name="appointmentLetter"
          value={formData.appointmentLetter}
          onChange={handleChange}
          error={!!errors.appointmentLetter}
          helperText={errors.appointmentLetter}
          sx={{ mb: 2 }}
        />
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
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Submit Placement Details
        </Button>
      </form>
    </Container>
  );
}
