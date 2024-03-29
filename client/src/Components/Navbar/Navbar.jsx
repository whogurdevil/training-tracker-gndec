import { useNavigate } from "react-router-dom";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import gndecLogo from '../../assets/gndec-logo.png'
import { Container , Modal } from "@mui/material";
import navbarimg from "../../assets/navbarimg.png"

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogoutConfirmed = () => {
    handleLogout();
    handleClose();
  };

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
            <Button variant="text" style={{ position: 'absolute', left: 5 }} onClick={handleGoBack}>Back</Button> {/* Back button */}
          <Container sx={{ display: 'flex', alignItems: 'center', paddingLeft: 0, marginLeft: 0 }}>
            <Button variant="text" onClick={handleGoBack}>Back</Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', width: '90vw' }}>
                <img src={navbarimg} style={{ width: '60vw', backgroundColor: 'white' }} alt="Navbar Img" />
              </Box>
            </Typography>
          </Container>
          <Button variant="text" style={{ position: 'absolute', right: 5 }} onClick={handleOpen}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="logout-modal-title" variant="h6" component="h2">
          Are you sure you want to logout?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={handleClose}  variant="contained" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirmed}  variant="contained">
            Logout
          </Button>
        </Box>
      </Box>
    </Modal>
  </div>);
}

export default Navbar;
