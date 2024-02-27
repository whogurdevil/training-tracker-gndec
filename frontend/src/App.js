import React, { Component } from 'react';
import Signup from './Components/Authentication/Signup';
import DashBoard from './Components/DashBoard';
import Login from './Components/Authentication/Login';
import Verify from './Components/Authentication/Verify';
import ForgotPassword from './Components/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Redirect to the dashboard if user is authenticated */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('authtoken');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return <DashBoard />;
  }
};

export default App;
