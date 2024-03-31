import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FileBase from 'react-file-base64';
import Grid from '@mui/material/Grid';
import { openBase64NewTab } from '../utils/base64topdf';
import EditIcon from '@mui/icons-material/Edit';
import { convertBackendDateToPickerFormat } from '../utils/DateConvertToFrontend';
import { jwtDecode } from "jwt-decode";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'

export default function PlacementForm() {
  const [formData, setFormData] = useState({
    company: '',
    placementType: '',
    highStudy: '',
    appointmentNo: '',
    appointmentLetter: null,
    package: '',
    designation: '',
    gateStatus: '',
    gateCertificate: '',
    appointmentDate: '',
    isPlaced: null,
    highStudyplace: ''
  });
  const [isPlaced, setIsPlaced] = useState("");
  const [isHighstudy, setHighstudy] = useState("No");
  const [gateStatus, setgateStatus] = useState("No");
  const [highStudyplace, sethighStudyplace] = useState("");


  const decodeAuthToken = (token) => {
    try {
      if (!token) {
        throw new Error('Token is null or empty');
      }
      const decodedToken = jwtDecode(token);
      const crn = decodedToken.crn;
      return crn;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  const token = localStorage.getItem("authtoken");
  const crn = decodeAuthToken(token);
  const [errors, setErrors] = useState({});
  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [GateCertificate, setGateCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isLock, setIsLock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        const url = `${API_URL}placement/${crn}`;
        const response = await axios.get(url, {
          headers: {
            "auth-token": token
          }
        });
        const userData = response.data.data;

        // Check if all required fields are present in the fetched data
        if (userData.highStudy && userData.gateStatus) {
          // Convert the appointment date to date picker format
          const formattedAppointmentDate = convertBackendDateToPickerFormat(userData.appointmentDate);

          // Set form data with fetched values
          setFormData({
            ...userData,
            appointmentDate: formattedAppointmentDate,
            isPlaced: userData.isPlaced ? convertBackendDateToPickerFormat(userData.appointmentDate) : null
          });

          // Set other state variables
          setIsLock(userData.lock || false);
          setIsPlaced(userData.isPlaced ? "true" : "false");
          setHighstudy(userData.highStudy);
          setgateStatus(userData.gateStatus);
          sethighStudyplace(userData.highStudyplace)
          setGateCertificate(userData.gateCertificate);
          setAppointmentLetter(userData.appointmentLetter);
          setIsEditing(false);
        } else {
          console.error('Error: Fetched data is incomplete.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (newDate) => {
    // Extract year, month, and day from the selected date
    const year = newDate.$y;
    const month = newDate.$M + 1; // Months start from 0, so add 1
    const day = newDate.$D;

    // Format the date string
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    setFormData({ ...formData, appointmentDate: formattedDate });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Dynamic regex and validation check messages
    let regex;
    let errorMsg;
    switch (name) {
      case 'contact':
        regex = /^\d{10}$/;
        errorMsg = 'Contact must be 10 digits';
        break;
      case 'crn':
        regex = /^\d{7}$/;
        errorMsg = 'CRN must be a 7-digit number';
        break;
      default:
        break;
    }
    if (regex && !regex.test(value)) {
      setErrors({ ...errors, [name]: errorMsg });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation

      const formErrors = {};
      if (formData.isPlaced === true) {
        if (!formData.company.trim()) {
          formErrors.company = 'Company name cannot be blank';
          toast.error(formErrors.company);
        } else if (!formData.designation) {
          formErrors.designation = 'Designation cannot be blank';
          toast.error(formErrors.designation);
        } else if (!formData.appointmentNo) {
          formErrors.appointmentNo = 'Appointment No is required ';
          toast.error(formErrors.appointmentNo);
        } else if (!formData.appointmentDate) {
          formErrors.appointmentDate = 'Appointment Date cannot be blank';
          toast.error(formErrors.appointmentDate);
        } else if (!formData.appointmentLetter) {
          formErrors.appointmentLetter = 'Appointment Letter cannot be blank';
          toast.error(formErrors.appointmentLetter);
        } else if (!formData.package) {
          formErrors.package = 'Package cannot be blank';
          toast.error(formErrors.package);
        }
      } else if (formData.isPlaced === null) {
        formErrors.isPlaced = 'Placed or Not field cannot be blank';
        toast.error(formErrors.isPlaced);
      } else if (!formData.highStudy) {
        formErrors.highStudy = 'High Study field cannot be blank';
        toast.error(formErrors.highStudy);
      } else if (isHighstudy === "Yes" && !formData.highStudyplace) {
        formErrors.highStudyplace = "Place of High Study Cannot be blank";
        toast.error(formErrors.highStudyplace);
      } else if (!formData.gateStatus) {
        formErrors.gateStatus = "Gate Status Field Cannot Be Blank";
        toast.error(formErrors.gateStatus);
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      const token = localStorage.getItem('authtoken');
      // Submit form data
      const response = await axios.post(`${API_URL}placement`, {
        formData: formData,
        crn: crn,
      },
        {
          headers: {
            "auth-token": token
          }
        });

      if (response.data.success) {
        toast.success('Placement details submitted successfully!');
        setIsSubmitting(false);
        setIsEditing(false);
      } else {
        toast.error('Failed to submit placement details. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the placement details.');
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (files, data) => {
    setFormData({ ...formData, data: files.base64 });
    setAppointmentLetter(files.base64);
  };


  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleViewCertificate = (data) => {
    if (data) {
      openBase64NewTab(data);
    } else {
      openBase64NewTab(formData.data);
    }
  };


  const handleIsPlacedChange = (e) => {
    const { name, value } = e.target;
    setIsPlaced(value)
    if (value) {
      let newvalue = (value === "true")
      setFormData({ ...formData, [name]: newvalue });
    }

  };

  const handleIsHighChange = (e) => {
    // console.log(e.target)
    const { name, value } = e.target;
    setHighstudy(value);

    setFormData({ ...formData, [name]: value });
  };
  const handleIsGateStatusChange = (e) => {
    // console.log(e.target)
    const { name, value } = e.target;
    setgateStatus(value);

    setFormData({ ...formData, [name]: value });
  };
  const handlehighStudyplace = (e) => {
    // console.log(e.target)
    const { name, value } = e.target;
    sethighStudyplace(value);

    setFormData({ ...formData, [name]: value });

  };

  return (
    <Container style={{ marginBottom: "100px" }}>

      <Container style={{ paddingInline: 0, paddingBottom: 50, marginTop: '15px' }} >
        {!isLock && (
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            style={{
              position: 'relative',
              float: 'left',
            }}
          >

            <EditIcon />
          </Button>
        )}
        {isEditing && !isLock && (
          <Button
            type="submit"
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            disabled={isSubmitting}
            style={{
              position: 'relative',
              float: 'right',
            }}
          >
            Submit
          </Button>
        )}
        <div style={{
          display: 'flex', gap: '10px', position: 'relative',
          float: 'right',
        }}>
          {!isEditing && appointmentLetter && (
            <Button onClick={() => handleViewCertificate(appointmentLetter)}
              variant="outlined" color="primary">
              View Appointment Letter
            </Button>
          )}
          {!isEditing && (gateStatus === "Yes") && (
            <Button onClick={() => handleViewCertificate(GateCertificate)} variant="outlined" color="primary">
              View Gate Admit Card
            </Button>
          )}
        </div>
      </Container>
      <Typography variant="h5" gutterBottom>
        Please fill in your placement details below.
      </Typography>

      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Have you been placed?"
          variant="outlined"
          fullWidth
          required
          name="isPlaced"
          value={isPlaced}
          onChange={handleIsPlacedChange}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          <MenuItem value={""}>None</MenuItem>
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>

      </Grid>

      {isPlaced === "true" && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                required
                name="company"
                value={formData.company}
                onChange={handleChange}
                error={!!errors.company}
                helperText={errors.company}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
              <TextField
                label="Designation"
                variant="outlined"
                fullWidth
                required
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={!!errors.designation}
                helperText={errors.designation}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>

              <TextField
                label="Appointment Number"
                variant="outlined"
                fullWidth
                required
                name="appointmentNo"
                type="number"
                value={formData.appointmentNo}
                onChange={handleChange}
                error={!!errors.appointmentNo}
                helperText={errors.appointmentNo}
                sx={{ mb: 2 }}
                disabled={!isEditing || isSubmitting}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DatePicker

                  label="Appointment Date"
                  views={['year', 'month', 'day']}
                  renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
                  onChange={handleDateChange}
                  value={formData.appointmentDate}

                  disabled={!isEditing || isSubmitting}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} marginTop={2}>
            <TextField
              select
              label="Placement Type"
              placeholder='Select any one'
              variant="outlined"
              fullWidth
              required
              name="placementType"
              value={formData.placementType}
              onChange={handleChange}
              sx={{ mb: 2 }}
              disabled={!isEditing || isSubmitting}
            >
              <MenuItem value="On Campus">On Campus</MenuItem>
              <MenuItem value="Off Campus">Off Campus</MenuItem>
            </TextField>

            <TextField
              label="Package"
              placeholder='in LPA'
              variant="outlined"
              fullWidth
              required
              name="package"
              style={{ marginTop: '10px' }}
              value={formData.package}
              onChange={handleChange}
              error={!!errors.package}
              helperText={errors.package}
              sx={{ mb: 2 }}
              disabled={!isEditing || isSubmitting}
            />

          </Grid>

          {isEditing && (
            <Grid item xs={12} md={6} marginBottom={2} container justifyContent="space-between" alignItems="center">

              <Typography variant="h6" gutterBottom textAlign="left" >
                Upload Appointment Letter
              </Typography>
              <FileBase
                type="file"
                multiple={false}
                onDone={() => handleFileChange(appointmentLetter)}
                disabled={!isEditing || isSubmitting}
              />

            </Grid>)}

        </>
      )}
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Will you pursue higher studies?"
          placeholder='Select any one'
          variant="outlined"
          fullWidth
          required
          name="highStudy"
          value={isHighstudy}
          onChange={handleIsHighChange}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          <MenuItem value={""}>None</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>
      {isHighstudy === "Yes" && (
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Where do you want to pursue higher Studies?"
            variant="outlined"
            fullWidth
            required
            name="highStudyplace"
            value={highStudyplace}
            onChange={handlehighStudyplace}
            sx={{ mb: 2 }}
            disabled={!isEditing || isSubmitting}
          >
            <MenuItem value={""}>None</MenuItem>
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="Outside">Abroad</MenuItem>
          </TextField>
        </Grid>
      )}

      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Have you appeared in Gate Exam?"
          variant="outlined"
          placeholder='Select any one'
          fullWidth
          required
          name="gateStatus"
          value={gateStatus}
          onChange={handleIsGateStatusChange}
          sx={{ mb: 2 }}
          disabled={!isEditing || isSubmitting}
        >
          <MenuItem value={""}>None</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>
      {isEditing && (gateStatus === "Yes") && (
        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom textAlign="left" marginTop={2}>
            Upload Gate Admit Card / Scorecard
          </Typography>
          <FileBase
            type="file"
            multiple={false}
            onDone={() => handleFileChange(GateCertificate)}
            disabled={!isEditing || isSubmitting}
          />
        </Grid>

      )}



      <ToastContainer />
    </Container>
  );
}
