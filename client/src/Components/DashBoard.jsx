import React, { useState , useEffect} from 'react';
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
        const url = `http://localhost:8000/userprofiles/${urn}`;
        const response = await axios.get(url);
        const userData = response.data.data;
        console.log(userData);


        // Check if all fields are filled in the fetched data
        if (
          userData.Name &&
          userData.contact &&
          userData.crn &&
          userData.branch &&
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
      const response = await axios.post('http://localhost:8000/userprofiles', { formData, urn: urn });
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
    <Container sx={{paddingTop:10}}>
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
          disabled={!isEditing || isSubmitting}
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
          disabled={!isEditing || isSubmitting}
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
          disabled={!isEditing || isSubmitting}
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
          disabled={!isEditing || isSubmitting}
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
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker
            label="Start Year"
            views={['year']}
            renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
            onChange={handleBatchChange}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          />
        </LocalizationProvider>
        
        {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker
            disabled
            label="End Year"
            views={['year']}
            renderInput={(params) => <TextField {...params} helperText="Ending year" />}
            value={endDate}
          />
        </LocalizationProvider> */}
        {/* <TextField
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
        /> */}
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
          disabled={!isEditing || isSubmitting}
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
          disabled={!isEditing || isSubmitting}
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
          disabled={!isEditing || isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
