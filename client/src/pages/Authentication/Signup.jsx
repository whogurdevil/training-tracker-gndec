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
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL


function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
  const [showModal, setShowModal] = useState(false);
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'crn':
        return /^\d{7}$|^Tr\d{3}$/.test(value) ? '' : 'Invalid CRN: must be a 7-digit number';
      case 'email':
        // return value.endsWith('@gndec.ac.in') ? '' : 'Invalid Email: must end with @gndec.ac.in';
        return value.endsWith('@gndec.ac.in') ? '' : 'Invalid Email: must end with @gndec.ac.in';
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
    if (name === "email") {
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
    setShowModal(false)
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
      const response = await fetch(`${API_URL}auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      if (json.success) {
        toast.success('Successfully signed up');
        setTimeout(() => {
          navigate('/verify', { state: { email: credentials.email } });
        }, 2000);
      } else {
        toast.error(json.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error('Invalid Credentials');
      setLoading(false);
    }
  };
  const handleConfirm = async () => {
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
      const response = await fetch(`${API_URL}auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      if (json.success) {
        toast('Successfully signed up');
        setTimeout(() => {
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
    <Container component="main" maxWidth="xs" sx={{ pb: 5, mt: 5 }} style={{ marginBottom: "50px" }}>
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
        <Box sx={{ mt: 1 }}>
          <TextField InputLabelProps={{ shrink: true }}
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
          <TextField InputLabelProps={{ shrink: true }}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            value={credentials.password}
            type={showPassword ? 'text' : 'password'} // Show password text if showPassword is true
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField InputLabelProps={{ shrink: true }}
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
          <TextField InputLabelProps={{ shrink: true }}
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
            onClick={() => setShowModal(true)}
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
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 5
        }}>
          <Typography variant="h6" fontWeight={'bold'} gutterBottom>
            Confirm data before submitting
          </Typography>
          <Typography variant="body1" >
            Email: {credentials.email}
          </Typography>
          {/* <Typography variant="body1" gutterBottom>
            Password: {credentials.password}
          </Typography> */}
          <Typography variant="body1" >
            CRN: {credentials.crn}
          </Typography>
          <Alert
            sx={{ marginTop: 5 }}
            severity='info'
          >This information will be used for official data storage in future operations</Alert>
          <hr />
          <div style={{ display: 'flex', justifyContent: "flex-end", gap: 25, paddingTop: 10 }}>
            <Button variant="contained" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}

export default Signup;
