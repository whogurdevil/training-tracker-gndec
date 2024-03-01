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
import FileBase from 'react-file-base64';
import Grid from '@mui/material/Grid';
import { base64toBlob, openBase64NewTab } from '../CommonComponent/base64topdf';
import EditIcon from '@mui/icons-material/Edit';



export default function Form() {
  const [formData, setFormData] = useState({
    technology: [],
    projectName: '', // corrected typo here
    type: '',
    certificate: null,
  });
  const location = useLocation();
  const urn = location.state && location.state.urn;
  const number = location.state && location.state.number
  const [errors, setErrors] = useState({});
  const [certificate, setCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const handleFileChange = (files) => {
    setFormData({ ...formData, certificate: files.base64 });
    setCertificate(files.base64);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If it's the technology field, handle as an array
    if (name === 'technology') {
      setFormData({ ...formData, [name]: e.target.value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear errors when input changes
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation
      const formErrors = {};
      if (formData.technology.length === 0) {
        formErrors.technology = 'Technology cannot be blank';
      }
      if (!formData.projectName.trim()) {
        formErrors.projectName = 'Project Name cannot be blank';
      }
      if (!formData.type.trim()) {
        formErrors.type = 'Type cannot be blank';
      }
      if (!formData.certificate) {
        formErrors.certificate = 'Certificate cannot be blank';
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Submit form data
      console.log(number)
      console.log("formData", formData)
      const url = `http://localhost:8000/tr${number}`
      const response = await axios.post(url, { formData, urn: urn });

      console.log("response", response)
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        setIsSubmitting(false);
        setIsEditing(false);
      } else {
        toast.error('Failed to submit form. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the form.');
      setIsSubmitting(false);
    }
  };
  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleViewCertificate = () => {
    openBase64NewTab(certificate);
  };
  return (
    <Container sx={{ paddingTop: 10 }}>
      {/* Edit button */}
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

      {/* Fill the form */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5" gutterBottom>
          Fill the Form :
        </Typography>
      </Grid>

      {/* Toast Container */}
      <ToastContainer />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Technology */}
        <TextField
          select
          label="Technology"
          variant="outlined"
          fullWidth
          required
          name="technology"
          value={formData.technology}
          onChange={handleChange}
          SelectProps={{ multiple: true }}
          error={!!errors.technology}
          helperText={errors.technology}
          style={{ marginBottom: '1rem' }}
          disabled={!isEditing || isSubmitting}
        >
          {/* Dropdown options */}
          <MenuItem value="React">React</MenuItem>
          <MenuItem value="Node.js">Node.js</MenuItem>
          <MenuItem value="Python">Python</MenuItem>
          {/* Add more options as needed */}
        </TextField>

        {/* Certificate */}
        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom textAlign="left" marginTop={2}>
            Upload Certificate
          </Typography>
          <FileBase
            type="file"
            multiple={false}
            onDone={handleFileChange}
            disabled={!isEditing || isSubmitting}
          />
        </Grid>

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
          disabled={!isEditing || isSubmitting}
        />

        {/* Type */}
        <TextField
          select
          label="Type"
          variant="outlined"
          fullWidth
          required
          name="type"
          value={formData.type}
          onChange={handleChange}
          error={!!errors.type}
          helperText={errors.type}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          {/* Dropdown options */}
          <MenuItem value="PaidIntership">Paid Intership</MenuItem>
          <MenuItem value="InternshipWithStipend">Internship With Stipend</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
        </TextField>

        {/* View Certificate Button */}
        {!isEditing && (
          <Button onClick={handleViewCertificate} variant="outlined" color="primary">
            View Certificate
          </Button>
        )}

        {/* Submit Button */}
        {isEditing && (
          <Button
            type="submit"
            color="primary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        )}
      </form>
    </Container>
  );
}