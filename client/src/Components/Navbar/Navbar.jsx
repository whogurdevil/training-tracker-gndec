import { useNavigate } from "react-router-dom";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome!
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

