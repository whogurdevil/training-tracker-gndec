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

export default function Form() {
  const [formData, setFormData] = useState({
    technology: '',
    projectName: '', // corrected typo here
    type: ''
  });
  const location = useLocation();
  const urn = location.state && location.state.urn;
  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when input changes
    setErrors({ ...errors, [name]: '' });
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation
      const formErrors = {};
      if (!formData.technology.trim()) {
        formErrors.technology = 'Technology cannot be blank';
      }
      if (!formData.projectName.trim()) {
        formErrors.projectName = 'Project Name cannot be blank';
      }
      if (!formData.type.trim()) {
        formErrors.type = 'Type cannot be blank';
      }
      if (!uploadedFile) {
        formErrors.certificate = 'Certificate is required';
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      const response = await axios.post('http://localhost:8000/tr101', { formData, urn });
      console.log(response);
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        // Clear form data after successful submission
        setFormData({
          technology: '',
          projectName: '',
          type: ''
        });
        setUploadedFile(null); // Clear uploaded file after submission
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
        Fill the Form :
      </Typography>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* Technology */}
        <TextField
          label="Technology"
          variant="outlined"
          fullWidth
          required
          name="technology"
          value={formData.technology}
          onChange={handleChange}
          error={!!errors.technology}
          helperText={errors.technology}
          style={{ marginBottom: '1rem' }}
        />
        {/* Certificate */}
        <div style={{ border: '1px solid grey', padding: '1rem', marginBottom: '1rem' }}>
          <Typography variant="subtitle1" gutterBottom>
            Upload Certificate *
          </Typography>
          <input
            type="file"
            accept=".pdf"
            onChange={handleCertificateUpload}
            style={{ display: 'none' }}
            id="certificate-upload"
            required
          />
          <label htmlFor="certificate-upload">
            <Button variant="outlined" component="span">
              Choose File
            </Button>
          </label>
          {uploadedFile && (
            <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
              Uploaded File: {uploadedFile.name}
            </Typography>
          )}
          {errors.certificate && (
            <Typography variant="body2" style={{ color: 'red' }}>
              {errors.certificate}
            </Typography>
          )}
        </div>
        {/* Project Name */}
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          required
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          error={!!errors.projectName}
          helperText={errors.projectName}
          style={{ marginBottom: '1rem' }}
        />
        {/* Type */}
        {/* Branch */}
        <TextField
          select // Use select for dropdown
          label="Type"
          variant="outlined"
          fullWidth
          required
          name="type"
          value={formData.type}
          onChange={handleChange}
          error={!!errors.type}
          helperText={errors.type}
          sx={{ mb: 2 }} // Add vertical spacing
        >
          {/* Dropdown options */}
          <MenuItem value="PaidIntership">Paid Intership</MenuItem>
          <MenuItem value="InternshipWithStipend">Internship With Stipend</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
          
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
