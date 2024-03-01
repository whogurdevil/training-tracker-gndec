import React, { Component } from 'react';
import Signup from './Components/Authentication/Signup';
import DashBoard from './Components/DashBoard';
import Home from './Components/Home'
import Login from './Components/Authentication/Login';
import Verify from './Components/Authentication/Verify';
import ForgotPassword from './Components/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from "./Components/AdminDashboard/Admin";
import Navbar from './Components/Navbar/Navbar';
import PlacementForm from './Components/PlacementInput';
import Training101 from './Components/Training101'
// import Training102 from './Components/Training102'
// import Training103 from './Components/Training103'
// import Training104 from './Components/Training104'

// import './App.css';

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
            <Route path="/home" element={<ProtectedRoute component={Home} />} />
            <Route path='/placement' element={<ProtectedRoute component={PlacementForm} />} />
            <Route path='/tr' element={<ProtectedRoute component={Training101} />} />
       
            <Route path="/admin" element={<ProtectedRoute component={Admin} />} />
            <Route path="/dashboard" element={<ProtectedRoute component={DashBoard} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('authtoken');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return <Component {...rest} />;
  }
};

export default App;
