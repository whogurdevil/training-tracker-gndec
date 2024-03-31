import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'


function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    crn: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    crn: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'crn':
        return /^\d{7}$|^Tr\d{3}$/.test(value) ? '' : 'Invalid CRN: must be a 7-digit number';
      case 'email':
        // return value.endsWith('@gndec.ac.in') ? '' : 'Invalid Email: must end with @gndec.ac.in';
        return value.endsWith('@gmail.com') ? '' : 'Invalid Email: must end with @gndec.ac.in';
      case 'password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
      case 'confirmPassword':
        return value === credentials.password ? '' : 'Passwords do not match';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==="email"){
      let crn = '';
      const match = value.match(/\d+/);
      if (match) {
        crn = match[0];
      }

      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: value,
        crn: crn, // Set the CRN extracted from the email
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, crn),
      }));
    
    }
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationErrors = Object.keys(credentials).reduce((acc, key) => {
        const error = validateField(key, credentials[key]);
        return error ? { ...acc, [key]: error } : acc;
      }, {});

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Post request
      const response = await fetch(`${API_URL}api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      // console.log(json);
      if (json.success) {
        toast('Successfully signed up');
        setTimeout(() => {
          // console.log(credentials.email);
          navigate('/verify', { state: { email: credentials.email } });
        }, 2000);
      } else {
        toast(json.message);
        setLoading(false);
      }
    } catch (error) {
      toast('Invalid Credentials');
      setLoading(false);
    }
  };

  const theme = createTheme();

  return (
    <Container component="main" maxWidth="xs" sx={{ pb: 5 , mt: 5 }} style={{marginBottom:"50px"}}>
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
          placeholder='nameCRN@gndec.ac.in'
            label="Email Address"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
           
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            value={credentials.password}
            type="password"
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
           
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            value={credentials.confirmPassword}
            type="password"
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
           
          />
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='1234567'
            id="crn"
            label="CRN"
            name="crn"
            value={credentials.crn}
            onChange={handleChange}
            autoFocus
            error={Boolean(errors.crn)}
            helperText={errors.crn}
            disabled={true}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="primary" /> // Render CircularProgress if loading is true
            ) : (
              'Sign up'
            )}
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="/login" variant="body2" style={{ color: '#0015ff' }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
