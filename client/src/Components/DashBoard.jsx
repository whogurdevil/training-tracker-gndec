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
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem for dropdown options
import CustomizedTimeline from './Home/Timeline';

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
    // Automatically format batch input
    if (name === 'batch') {
      if (value.length === 4 && /^\d{4}$/.test(value)) {
        const formattedBatch = `${value}-${parseInt(value) + 4}`;
        setFormData({ ...formData, [name]: formattedBatch });
      } else if (value.length === 5 && /^\d{4}-\d{4}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value.slice(0, 4) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      if (!formData.Name.trim()) {
        formErrors.Name = 'Name cannot be blank';
      }
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      const response = await axios.post('http://localhost:8000/userprofiles', { formData, urn: urn });
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
    <Container sx={{paddingTop:10}}>
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
          sx={{ mb: 2 }} // Add vertical spacing
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
          sx={{ mb: 2 }} // Add vertical spacing
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
          sx={{ mb: 2 }} // Add vertical spacing
        />
        {/* Branch */}
        <TextField
          select // Use select for dropdown
          label="Branch"
          variant="outlined"
          fullWidth
          required
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          error={!!errors.branch}
          helperText={errors.branch}
          sx={{ mb: 2 }} // Add vertical spacing
        >
          {/* Dropdown options */}
          <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
          <MenuItem value="IT">Information Technology</MenuItem>
          <MenuItem value="ECE">Electronics and Communication Engineering</MenuItem>
          <MenuItem value="EE">Electrical Engineering</MenuItem>
          <MenuItem value="ME">Mechanical Engineering</MenuItem>
          <MenuItem value="CE">Civil Engineering</MenuItem>
        </TextField>
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
          sx={{ mb: 2 }} // Add vertical spacing
        />
        {/* Gender */}
        <TextField
          select // Use select for dropdown
          label="Gender"
          variant="outlined"
          fullWidth
          required
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={!!errors.gender}
          helperText={errors.gender}
          sx={{ mb: 2 }} // Add vertical spacing
        >
          {/* Dropdown options */}
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
        {/* Admission Type */}
        <TextField
          select // Use select for dropdown
          label="Admission Type"
          variant="outlined"
          fullWidth
          required
          name="admissionType"
          value={formData.admissionType}
          onChange={handleChange}
          error={!!errors.admissionType}
          helperText={errors.admissionType}
          sx={{ mb: 2 }} // Add vertical spacing
        >
          {/* Dropdown options */}
          <MenuItem value="Non LEET">Non LEET</MenuItem>
          <MenuItem value="LEET">LEET</MenuItem>
        </TextField>
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
