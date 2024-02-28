import React, { useState , useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import FileBase from 'react-file-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MuiChipsInput } from 'mui-chips-input'

import Box from '@mui/material/Box';
import axios from 'axios';
import Grid from '@mui/material/Grid'; // Import Grid component
import Navbar from './Navbar/Navbar';

export default function Form() {
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    experience: '',
    education: '',
    skills: [],
    location: '',
    resume: null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSkillsChange = (chips) => {
  //   setFormData({ ...formData, skills: chips });
  // };
  const handleSkillsChange = (newChips) => {
    setFormData({ ...formData, skills: newChips });
  }
  const handleFileChange = (files) => {
    setFormData({ ...formData, resume: files.base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userId');
      console.log(token)
     
        // Set user ID in formData
      //  setFormData({ ...formData, userId: token });
      
      console.log(formData)
      await axios.post('http://localhost:8000/userprofiles/', { ...formData, userId: token });
      notifySuccess();
      clearForm();
    } catch (error) {
      notifyFailure();
      console.error('Error submitting data:', error);
    }
  };

  const notifySuccess = () => toast.success("Candidate Profile Successfully Uploaded!");
  const notifyFailure = () => toast.error("Error Occurred During Uploading...");

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      experience: '',
      education: '',
      skills: [],
      location: '',
      resume: null
    });
  };

  return (
    <>
      <Navbar/>
      <Container style={{ paddingBottom: '20vh' }}>
        <Typography
          variant="h5"
          color='textSecondary'
          component='h2'
          align='center'
          justify='center'
          fontWeight='bold'
          margin={5}
          gutterBottom
        >
          Please fill in your information below.
        </Typography>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <Typography variant="h6" gutterBottom textAlign={'left'}>
            Personal Details
          </Typography>
          <Grid container spacing={2}> {/* Add Grid container with spacing */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact"
                variant="outlined"
                fullWidth
                required
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                variant="outlined"
                fullWidth
                required
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education"
                variant="outlined"
                fullWidth
                required
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} >
            <TextField
                label="Location"
                variant="outlined"
                fullWidth
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={1}>
            {/* Skills */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom textAlign={'left'}>
                Skills
              </Typography>
              <MuiChipsInput
                // label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                value={formData.skills}
                onChange={handleSkillsChange}
                fullWidth
              />
            </Grid>
            {/* Location */}
            <Grid item xs={12}>
              {/* <Typography variant="h6" gutterBottom textAlign={'left'} marginTop={2}>
                Location
              </Typography> */}

              <Typography variant="h6" gutterBottom textAlign={'left'} marginTop={2}>
                Upload Resume
              </Typography>
            </Grid>

            <Grid item xs={12} container justifyContent="space-between">
              {/* Upload Resume */}
              <Grid item>

                <FileBase
                  type="file"
                  multiple={false}
                  onDone={handleFileChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item>
                <Button
                  type="submit"
                  color='primary'
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  size='large'
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>

        </form>
      </Container>
    </>
  );
}
