import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import FileBase from 'react-file-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChipInput from 'material-ui-chip-input';

import Box from '@mui/material/Box';

import axios from 'axios';

export default function Form() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    experience: '',
    education: '',
    skills: '',
    location: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (chips) => {
    setFormData({ ...formData, skills: chips });
  };

  const handleFileChange = (files) => {
    setFormData({ ...formData, resume: files.base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/userprofiles/', formData);
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
    <Container>
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
        <Typography variant="h6" gutterBottom>
          Personal Details
        </Typography>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          required
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          required
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Contact"
          variant="outlined"
          fullWidth
          required
          name="contact"
          value={formData.contact}
          onChange={handleChange}
        />
        <TextField
          label="Experience"
          variant="outlined"
          fullWidth
          required
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
        <TextField
          label="Education"
          variant="outlined"
          fullWidth
          required
          name="education"
          value={formData.education}
          onChange={handleChange}
        />
        <Box marginTop={3}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <ChipInput
            label="Skills"
            variant="outlined"
            helperText="Press enter to add skills"
            value={formData.skills}
            onAdd={(chip) => handleSkillsChange([...formData.skills, chip])}
            onDelete={(chip, index) => {
              const updatedSkills = formData.skills.filter((_, i) => i !== index);
              handleSkillsChange(updatedSkills);
            }}
            fullWidth
          />
        </Box>
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          required
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        {/* Upload Resume */}
        <Typography variant="h6" gutterBottom>
          Upload Resume
        </Typography>
        <FileBase
          type="file"
          multiple={false}
          onDone={handleFileChange}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          color='primary'
          variant="contained"
          justify='center'
          endIcon={<KeyboardArrowRightIcon />}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
