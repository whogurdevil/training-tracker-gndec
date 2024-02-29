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


export default function Form() {
  const [formData, setFormData] = useState({
    Name: '',
    contact: '',
    crn: '',
    branch: '',
    batch: '',
    gender: '',
    admissionType: ''
  });
  const location = useLocation();
  const urn = location.state && location.state.urn;
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when input changes
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation
      const formErrors = {};
      if (!formData.Name.trim()) {
        formErrors.Name = 'Name cannot be blank';
      }
      if (!formData.contact.trim() || !/^\d{10}$/.test(formData.contact)) {
        formErrors.contact = 'Contact must be 10 digits';
      }
      // Add more validations for other fields if needed

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      const response = await axios.post('http://localhost:8000/userprofiles', {formData,urn:urn});
      console.log(response);
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        // Clear form data after successful submission
        setFormData({
          Name: '',
          contact: '',
          crn: '',
          branch: '',
          batch: '',
          gender: '',
          admissionType: ''
        });
      } else {
        toast.error('Failed to submit form. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the form.');
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Please fill in your information below.
      </Typography>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          error={!!errors.Name}
          helperText={errors.Name}
        />
        {/* Contact */}
        <TextField
          label="Contact"
          variant="outlined"
          fullWidth
          required
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          error={!!errors.contact}
          helperText={errors.contact}
        />
        {/* CRN */}
        <TextField
          label="CRN"
          variant="outlined"
          fullWidth
          required
          name="crn"
          value={formData.crn}
          onChange={handleChange}
          error={!!errors.crn}
          helperText={errors.crn}
        />
        {/* Branch */}
        <TextField
          label="Branch"
          variant="outlined"
          fullWidth
          required
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          error={!!errors.branch}
          helperText={errors.branch}
        />
        {/* Batch */}
        <TextField
          label="Batch"
          variant="outlined"
          fullWidth
          required
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          error={!!errors.batch}
          helperText={errors.batch}
        />
        {/* Gender */}
        <TextField
          label="Gender"
          variant="outlined"
          fullWidth
          required
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={!!errors.gender}
          helperText={errors.gender}
        />
        {/* Admission Type */}
        <TextField
          label="Admission Type"
          variant="outlined"
          fullWidth
          required
          name="admissionType"
          value={formData.admissionType}
          onChange={handleChange}
          error={!!errors.admissionType}
          helperText={errors.admissionType}
        />
        {/* Add more fields as needed */}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
