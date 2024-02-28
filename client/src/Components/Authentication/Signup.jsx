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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone,
          gender: credentials.gender,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        toast('Successfully signed up');
        // ... rest of the code
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
  const handleGenderChange = (e) => {
    setCredentials({ ...credentials, gender: e.target.value });
  };
  

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCredentials({ ...credentials, [e.target.name]: value });
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{pb:5}}>
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
              id="name"
              label="Name"
              name="name"
              value={credentials.name}
              // autoComplete="name"
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
              // autoComplete="email"
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
              // autoComplete="current-password"
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              value={credentials.phone}
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={credentials.gender}
                label="Gender"
                onChange={handleGenderChange}
                sx={{height:80, textAlign:'left', pl:1}}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={credentials.gender}
                onChange={onChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl> */}
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={onChange}
                  color="primary"
                />
              }
              label="Remember me"
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
    </ThemeProvider>
  );
}

export default Signup;
