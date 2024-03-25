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
import navbarimg from "../../assets/navbarimg.png"

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('authtoken'); // Remove authentication token
    localStorage.removeItem('userId'); // Remove user ID or any other relevant data
    toast('Successfully logged out');
    console.log('test')
    navigate('/login')
  }

  function handleGoBack() {
    navigate(-1)
  }
  return ( <div>
    <Box sx={{ flexGrow: 1 }} margin={0}>
      <AppBar position="relative" sx={{ backgroundColor: '#FFF5E0' }}>
        <Toolbar sx={{ boxShadow: 'none' }}>
          <Container sx={{ display: 'flex', alignItems: 'center', paddingLeft: 0, marginLeft: 0 }}>
            <Button variant="text" onClick={handleGoBack}>Back</Button> {/* Back button */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', width: '90vw' }}>
                <img src={navbarimg} style={{ width: '60vw', backgroundColor: 'white' }} alt="Navbar Img" />
              </Box>
            </Typography>
          </Container>
          <Button variant="text" style={{ position: 'absolute', right: 5 }} onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  </div>);
}

export default Navbar;
