import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    urn: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!/^\d{7}$/.test(credentials.urn)) {
        toast('🚫 Invalid URN: must be a 7-digit number');
        setLoading(false);
        return;
      }
      if (!credentials.email.endsWith('@gndec.ac.in')) {
        toast('🚫 Invalid Email: must end with @gndec.ac.in');
        setLoading(false);
        return;
      }
      if (credentials.password !== credentials.confirmPassword) {
        toast('🚫 Passwords do not match');
        setLoading(false);
        return;
      }

      // Post request
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urn: credentials.urn,
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        toast('Successfully signed up');
        setTimeout(() => {
          navigate('/verify')
        }, 2000);
      } else {
        toast('🚫 Invalid Credentials');
        setLoading(false);
      }
    } catch (error) {
      toast('🚫 Invalid Credentials');
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCredentials({ ...credentials, [e.target.name]: value });
  };

  const theme = createTheme();

  return (
      <Container component="main" maxWidth="xs" sx={{ pb: 5 }}>
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
            Sign up
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
              onChange={onChange}
              autoFocus
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={credentials.email}
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
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
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              value={credentials.confirmPassword}
              type="password"
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
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