import { useNavigate } from "react-router-dom";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import gndecLogo from '../../assets/gndec-logo.png'
import { Container } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('authtoken'); // Remove authentication token
    localStorage.removeItem('userId'); // Remove user ID or any other relevant data
    toast('Successfully logged out');
    console.log('test')
    navigate('/login')
  }

  return (
    <Box sx={{ flexGrow: 1 }} margin={0}>
      <AppBar position="fixed">
        <Toolbar>
          <Container sx={{ display: 'flex', alignItems: 'center', paddingLeft:0, marginLeft:0}}>
            <img
              style={{ height: '50px', marginRight: '10px' }}
              src={gndecLogo}
              alt="GNDEC Logo"
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Training Data Tracker
            </Typography>
          </Container>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
