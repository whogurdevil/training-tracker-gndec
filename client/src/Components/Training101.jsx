import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FileBase from 'react-file-base64';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import { jwtDecode } from "jwt-decode";
import { useLocation } from 'react-router-dom';
import { base64toBlob, openBase64NewTab } from '../utils/base64topdf';
import { technologyStack } from '../utils/technology';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'


export default function Form() {
  const [formData, setFormData] = useState({
    organization: '',
    technology: [],
    projectName: '',
    type: '',
    certificate: null,
    organizationType:''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isLock, setIsLock] = useState(false);
  const [certificate, setCertificate] = useState(null);
  let location = useLocation();
  const number = location.state && location.state.number

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const urn = decodeAuthToken(token);
        // console.log(urn)
        const response = await axios.get(`${API_URL}tr${number}/${urn}`);
        const userData = response.data.data;

        if (
          userData.organization &&
          userData.technology &&
          userData.projectName &&
          userData.type &&
          userData.organizationType
        ) {
          setFormData(userData);
          setIsEditing(false);
          if (userData.lock) {
            setIsLock(true)
          } else {
            setIsLock(false)
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


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'technology') {
      setFormData({ ...formData, [name]: e.target.value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formErrors = {};
      if (formData.organization.length === 0) {
        formErrors.organization = 'Organization cannot be blank';
      }
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
        toast.error("certificate cannot be blank")
      }
      if (!formData.organizationType) {
        formErrors.organizationType = 'Organization-Type cannot be blank';
        toast.error("Organization-Type cannot be blank")
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const token = localStorage.getItem("authtoken");
      const urn = decodeAuthToken(token);
      const url = `${API_URL}tr${number}`
      const response = await axios.post(url, { formData, urn: urn });

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

  const handleViewCertificate = () => {
    if (certificate) {
      openBase64NewTab(certificate);
    }
    else {
      openBase64NewTab(formData.certificate);
    }
  };
  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleFileChange = (files) => {
    setFormData({ ...formData, certificate: files.base64 });
    setCertificate(files.base64);
  };

  return (
    <Container>
      <Container style={{ paddingInline: 0, paddingBottom: 50, paddingTop:10 }} >
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
        {!isEditing && (
          <Button onClick={handleViewCertificate} variant="outlined" color="primary" style={{
            position: 'relative',
            float: 'right',
          }}>
            View Certificate
          </Button>
        )}
      </Container>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Organization Name"
            variant="outlined"
            fullWidth
            required
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            error={!!errors.organization}
            helperText={errors.organization}
            style={{ marginBottom: '1rem' }}
            disabled={!isEditing || isSubmitting}
          />
          <TextField
            label="Project Title"
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
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Organization Type"
            variant="outlined"
            fullWidth
            required
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            error={!!errors.organizationType}
            helperText={errors.organizationType}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          >
            <MenuItem value="industry">Industrial</MenuItem>
            <MenuItem value="gndec">Institutional ( Guru Nanak Dev Engineering College , Ludhiana) </MenuItem>
            <MenuItem value="other">Other Institutional</MenuItem>
          </TextField>
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
            <MenuItem value="Training">Training / Internship Without Stipend</MenuItem>
            <MenuItem value="InternshipWithStipend">Internship With Stipend</MenuItem>
            <MenuItem value="PaidTraining">Paid Training</MenuItem>
          </TextField>
        </Grid>
      
      </Grid>
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
        {technologyStack.map((tech) => (
          <MenuItem key={tech} value={tech}>
            {tech}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="h6" gutterBottom textAlign="left" marginTop={2}>
        Upload Certificate
      </Typography>

      <FileBase
        type="file"
        multiple={false}
        onDone={handleFileChange}
        disabled={!isEditing || isSubmitting}
      />





      <ToastContainer />
    </Container>
  );
}
