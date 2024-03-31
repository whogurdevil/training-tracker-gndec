import { useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { Container, Modal } from '@mui/material';
import navbarimg from '../../assets/navbarimg.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('authtoken'); // Remove authentication token
    localStorage.removeItem('userId'); // Remove user ID or any other relevant data
    toast('Successfully logged out');
    navigate('/login')
    setOpen(false)
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const shouldShowLogoutButton = !(location.pathname.endsWith('/login') || location.pathname.endsWith('/signup'));
  const shouldShowBackButton = !(location.pathname.endsWith('/login') || location.pathname.endsWith('/signup'));

  return (
    <div>
      <Box sx={{ flexGrow: 1 }} margin={0}>
        <AppBar position="relative" sx={{ backgroundColor: '#FFF5E0' }}>
          <Toolbar sx={{ boxShadow: 'none' }}>
            {shouldShowBackButton && (
            <Button variant="text" style={{ position: 'absolute', left: 5 }} onClick={handleGoBack}>
              Back
            </Button>
            )}
            <Container sx={{ display: 'flex', alignItems: 'center', paddingLeft: 0, marginLeft: 0 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Box sx={{ textAlign: 'center', width: '90vw' }}>
                  <img src={navbarimg} style={{ width: '60vw', backgroundColor: 'white' }} alt="Navbar Img" />
                </Box>
              </Typography>
            </Container>
            {shouldShowLogoutButton && (
              <Button variant="text" style={{ position: 'absolute', right: 5 }} onClick={handleOpen}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            padding: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography id="logout-modal-title" variant="h6" component="h2" sx={{marginBlock:3}}>
            Are you sure ?
          </Typography>
          <hr/>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap:2 }}>
            <Button onClick={handleClose} variant="text">
              Cancel
            </Button>
            <Button onClick={handleLogout} variant="contained">
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Navbar;
