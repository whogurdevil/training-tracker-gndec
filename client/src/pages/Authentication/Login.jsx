import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { decodeUserRole } from "../../utils/AdminFunctions";

const API_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_DEV_BASE_URL;

function Login() {
  const [credentials, setCredentials] = useState({ crn: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ crn: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("authtoken");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, []);

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
      if (Object.values(validationErrors).some((error) => error !== "")) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      if (json.success) {
        if (json.message === "verify") {
          toast.warning("Please verify your account");
          setTimeout(() => {
            navigate("/verify");
          }, 2000);
        } else {
          localStorage.setItem("authtoken", json.authtoken);
          const role = decodeUserRole(json.authtoken)
          if (role === "superadmin" || role === "admin") {
            toast.success("Successfully logged in");
            setTimeout(() => {
              navigate("/superadmin");
            }, 1000);
          } else {
            toast.success("Successfully logged in");
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }
        }
      } else {
        toast.error(json.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "crn":
        return /^\d{7}$|^Tr\d{3}$/.test(value)
          ? ""
          : "Invalid CRN: must be a 7-digit number";
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters long";
      default:
        return "";
    }
  };

  const theme = createTheme();

  return (
    <Container component="main" maxWidth="xs" style={{ marginBottom: "100px" }}>
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
            fullWidth
            id="crn"
            label="Username/CRN"
            name="crn"
            placeholder="1234567"
            value={credentials.crn}
            onChange={handleChange}
            autoFocus
            error={Boolean(errors.crn)}
            helperText={errors.crn}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            value={credentials.password}
            type={showPassword ? "text" : "password"} // Show password text if showPassword is true
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
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="/forgotpassword"
                variant="body2"
                sx={{
                  color: "#1b29c2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1bb1c2",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="/signup"
                variant="body2"
                sx={{
                  color: "#1b29c2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1bb1c2",
                  },
                }}
              >
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
