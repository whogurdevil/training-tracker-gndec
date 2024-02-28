import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Verify() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);

  const handleGetOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/validate/sendotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email }),
      });

      const json = await response.json();

      if (json.success) {
        toast('OTP sent successfully');
        setShowOTPField(true); // Show OTP field after successful OTP request
      } else {
        toast('🚫 ' + json.message);
      }
    } catch (error) {
      console.error(error);
      toast('🚫 An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/validate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: credentials.otp }),
      });

      const json = await response.json();
        console.log(json)
      if (json.success) {
        toast('Successfully logged in');
        setLoading(false);

        setTimeout(() => {
          // Adjust the routing logic as per your requirements
navigate('/login')        }, 1000);
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

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
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
              id="email"
              label="Email Address"
              name="email"
              value={credentials.email}
              autoComplete="email"
              onChange={onChange}
              autoFocus
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            {showOTPField && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                value={credentials.otp}
                type="otp"
                onChange={onChange}
                InputProps={{
                  sx: { padding: '8px' },
                }}
              />
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={showOTPField ? handleSubmit : handleGetOTP}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : showOTPField ? 'Verify' : 'Get OTP'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Verify;
