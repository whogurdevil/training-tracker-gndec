
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem for dropdown options
// import CustomizedTimeline from './Home/Timeline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditIcon from '@mui/icons-material/Edit';
import { jwtDecode } from "jwt-decode";
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'


export default function Form() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    Name: '',
    contact: '',
    crn: '',
    branch: '',
    section: '',
    mentor: '',
    batch: '',
    gender: '',
    admissionType: ''
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Fetch data from the database when the component mounts or the page is refreshed
    const fetchData = async () => {

      try {
        const url = `${API_URL}userprofiles/${urn}`;
        const response = await axios.get(url);
        const userData = response.data.data;

        // Check if all fields are filled in the fetched data
        if (
          userData.Name &&
          userData.contact &&
          userData.crn &&
          userData.branch &&
          userData.section &&
          userData.mentor &&
          userData.batch &&
          userData.gender &&
          userData.admissionType

        ) {
          // If all fields are filled, populate the form data and disable editing
          setFormData(userData);
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

  // const [endDate, setEndDate] = useState(null);
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
      const response = await axios.post(`${API_URL}userprofiles`, { formData, urn: urn });
      console.log(response);
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
  const setSection = (value) => {
    setFormData({ ...formData, section: value });
  };
  const setMentor = (value) => {
    setFormData({ ...formData, mentor: value });
  };

  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };
  const handleBatchChange = (newDate) => {
    console.log(newDate);
    if (newDate) {
      // Extract the year from the newDate object
      const year = newDate.$y;
      console.log(year);

      setFormData({ ...formData, batch: `${year}-${year + 4}` });
    } else {
      // If newDate is null or undefined, clear the batch value
      setFormData({ ...formData, batch: '' });
    }
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <Container style={{ paddingTop: 4 }}>
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            style={{ position: 'relative' }}
          // endIcon={<EditIcon />}
          >
            {/* Edit */}
            <EditIcon />
          </Button>
          <Button
            style={{ float: 'right' }}
            type='submit'
            color="primary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={!isEditing || isSubmitting}
          >
            Submit
          </Button>
        </Container>
        <Container sx={{ margin: 0, padding: 0 }}>
          <Grid container spacing={isSmallScreen ? 2 : 4}>
            <Grid item xs={12} md={6} sx={{ textAlign: isSmallScreen ? 'left' : 'right' }}>
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
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
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
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
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
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
              <TextField
                select
                label="Section"
                variant="outlined"
                fullWidth
                required
                name="section"
                value={formData.section}
                onChange={(e) => setSection(e.target.value)}
                disabled={!isEditing || isSubmitting}
                sx={{
                  mb: 2,
                  '& .MuiSelect-select': { textAlign: 'left' } // Aligns the selected value to the left
                }}
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
                label="Mentor's Name"
                variant="outlined"
                fullWidth
                required
                name="mentor"
                value={formData.mentor}
                onChange={(e) => setMentor(e.target.value)}
                error={!!errors.mentor}
                helperText={errors.mentor}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />

            </Grid>
            <Grid item xs={12} md={6} >
              <TextField
                select
                label="Branch"
                variant="outlined"
                fullWidth
                required
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                error={!!errors.branch}
                helperText={errors.branch}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              >
                <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Year"
                  views={['year']}
                  renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
                  onChange={handleBatchChange}
                  sx={{ mb: 2 }}
                  disabled={!isEditing || isSubmitting}
                />
              </LocalizationProvider>
              <TextField
                select
                label="Gender"
                variant="outlined"
                fullWidth
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField
                select
                label="Admission Type"
                variant="outlined"
                fullWidth
                required
                name="admissionType"
                value={formData.admissionType}
                onChange={handleChange}
                error={!!errors.admissionType}
                helperText={errors.admissionType}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              >
                <MenuItem value="Non LEET">Non LEET</MenuItem>
                <MenuItem value="LEET">LEET</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Container>
      </form>
    </Container>
  )
}
