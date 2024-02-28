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
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const handleGetOtp = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/password/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        toast('OTP sent successfully');
        setLoading(false);
        setShowOtpField(true); // Show OTP field after successful OTP generation
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

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/password/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          otp: credentials.otp,
          newPassword: credentials.newPassword,
        }),
      });

      const json = await response.json();

      if (json.success) {
        toast('Password reset successful');
        setLoading(false);
        // Optionally, redirect the user to the login page or another route
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
            Forgot Password
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
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
            {showOtpField && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                value={credentials.otp}
                onChange={onChange}
                InputProps={{
                  sx: { padding: '8px' },
                }}
              />
            )}
            {showOtpField && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                value={credentials.newPassword}
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
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={showOtpField ? handleResetPassword : handleGetOtp}
            >
              {loading ? 'Processing...' : showOtpField ? 'Reset Password' : 'Get OTP'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2" style={{ color: '#0015ff' }}>
                  Remembered your password? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
