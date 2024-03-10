import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3fb589',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#00ff0d',
    },
  },
});

// Main component
const Main = () => {
  // Determine if user prefers dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Create theme based on user preference
  const darkTheme = createTheme({
    palette: {
      mode:'light',
      primary: {
        main: '#900000',
      },
      secondary: {
        main: '#f50057',
      },
      success: {
        main: '#00ff0d',
      },
      error: {
        main: '#ee2400'
      },
      background:{
        default: '#FFF7F1'
      },
      
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

// Render the main component
ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);
