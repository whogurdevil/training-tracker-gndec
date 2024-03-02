import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({ urn: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ urn: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      // Validation
      const validationErrors = {};
      for (const key in credentials) {
        validationErrors[key] = validateField(key, credentials[key]);
      }
      setErrors(validationErrors);

      // Check if there are any errors
      if (Object.values(validationErrors).some((error) => error !== '')) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        if (json.message === "verify") {
          toast('Please verify your account');
          setTimeout(() => {
            navigate('/verify');
          }, 2000);
        } else {
          localStorage.setItem('authtoken', json.authtoken);
          console.log(json.authtoken)
          if(json.body.user.role==='admin'){
            toast('Successfully logged in');
            setTimeout(() => {
              navigate('/admin');
            }, 1000);
          }else{
            toast('Successfully logged in');
            setTimeout(() => {
              navigate('/home');
            }, 1000);
          }
        }
      } else {
        toast('🚫 ' + json.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast('🚫 An error occurred');
      setLoading(false);
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'urn':
        return /^\d{7}$/.test(value) ? '' : 'Invalid URN: must be a 7-digit number';
      case 'password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
      default:
        return '';
    }
  };

  const theme = createTheme();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="urn"
            label="URN"
            name="urn"
            value={credentials.urn}
            onChange={handleChange}
            autoFocus
            error={Boolean(errors.urn)}
            helperText={errors.urn}
            InputProps={{
              sx: { padding: '8px' }, // Set the padding to 8px
            }}
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
            InputProps={{
              sx: { padding: '8px' }, // Set the padding to 8px
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="/forgotpassword"
                variant="body2"
                sx={{
                  color: '#1b29c2',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1bb1c2',
                  }
                }}
              >
                Forgot password?
              </Link>

            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2" sx={{
                color: '#1b29c2',
                textDecoration: 'none',
                '&:hover': {
                  color: '#1bb1c2',
                }
              }}>
                Do not have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
