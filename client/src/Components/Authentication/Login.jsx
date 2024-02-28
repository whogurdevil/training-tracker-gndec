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
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({ urn: null, password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urn: credentials.urn, password: credentials.password }),
      });
      console.log("urn",credentials.urn)
      console.log("password",credentials.password)

      const json = await response.json();
      console.log(json)
      if (json.success) {
        if (json.message === "verify") {
          toast('Please verify your account');
          setTimeout(() => {
            // Adjust the routing logic as per your requirements
            navigate('/verify')
          }, 2000);

        }
        else {
          toast('Successfully logged in');
          localStorage.setItem('authtoken', json.authtoken);
          // localStorage.setItem('userId', json.body.user.id);
          // console.log(json.body.user.id)
          // // console.log(json.body.user.role)
          // const role = json.body.user.role
          setLoading(false);
          // if (role === "admin") {
          //   setTimeout(() => {
          //     // Adjust the routing logic as per your requirements
          //     navigate('/admin')
          //   }, 2000);
          // } else {
            setTimeout(() => {
              // Adjust the routing logic as per your requirements
              navigate('/dashboard')
            }, 1000);
          // }

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

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
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
            label="Urn"
            name="urn"
            value={credentials.urn}
            autoComplete="urn"
            onChange={onChange}
            autoFocus
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
            autoComplete="current-password"
            onChange={onChange}
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
            {loading ? 'Signing In...' : 'Sign In'}
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
