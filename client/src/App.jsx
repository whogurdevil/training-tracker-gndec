import React, { Component } from 'react';
import Signup from './Components/Authentication/Signup';
import DashBoard from './Components/DashBoard';
import Home from './Components/Home'
import Login from './Components/Authentication/Login';
import Verify from './Components/Authentication/Verify';
import ForgotPassword from './Components/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdmin from './Components/SuperAdminDashboard/SuperAdmin'
import Navbar from './Components/Navbar/Navbar';
import PlacementForm from './Components/PlacementInput';
import Training101 from './Components/Training101'
import ProtectedRoute from './CommonComponent/ProtectedRoute';
import Admin from './Components/AdminDashboard/AdminDashboard'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Redirect to the dashboard if user is authenticated */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute path="/home" component={Home} />} />
            <Route path='/placement' element={<ProtectedRoute path="/placement" component={PlacementForm} />} />
            <Route path='/tr' element={<ProtectedRoute path="/tr" component={Training101} />} />
            <Route path="/superadmin" element={<ProtectedRoute path="/superadmin" component={SuperAdmin} />} />
            <Route path="/admin" element={<ProtectedRoute path="/admin" component={Admin} />} />
            <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" component={DashBoard} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
