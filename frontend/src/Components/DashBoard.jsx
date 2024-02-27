import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Drawer, AppBar, Toolbar, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { makeStyles } from '@mui/styles';// Correct import for makeStyles
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  // drawerPaper: {
  //   width: 240,
  // },
  content: {
    flexGrow: 1,
    
  },
  formControl: {
    
    minWidth: 120,
  },
  
}));

function DrawerAppBar(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    skills: [],
    contact: "",
    email: "",
    experience: "",
    resume: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/getuser", {
          headers: {
            "auth-token": localStorage.getItem("authtoken"),
          },
        });
        const userData = response.data;
        if (userData.success) {
          setIsAdmin(userData.data.role === "admin");
        } else {
          console.error("Error fetching user details:", userData.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleFileChange = (event) => {
    setFormData({ ...formData, resume: event.target.files[0] });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Implement form submission logic here
    console.log(formData);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            {isAdmin ? "Admin Dashboard" : "Employee Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
          {/* Form for employee */}
          {!isAdmin && (
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Name"
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Location"
                    fullWidth
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth className={classes.formControl}>
                    <InputLabel id="skills-label">Skills</InputLabel>
                    <Select
                      labelId="skills-label"
                      multiple
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {/* Render skills options here */}
                      <MenuItem value="Skill 1">Skill 1</MenuItem>
                      <MenuItem value="Skill 2">Skill 2</MenuItem>
                      {/* Add more skills options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Add other form fields (contact, email, experience) similarly */}
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Contact"
                    fullWidth
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Experience"
                    fullWidth
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="application/pdf"
                    style={{ display: "none" }}
                    id="resume-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resume-file">
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.uploadButton}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Resume (PDF)
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Typography>
      </main>
    </div>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
