import React, { Component } from "react";
import Signup from "./pages/Authentication/Signup";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";
import Login from "./pages/Authentication/Login";
import Verify from "./pages/Authentication/Verify";
import ForgotPassword from "./pages/Authentication/Forgotpassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuperAdminForm from "./pages/SuperAdminDashboard/SuperAdmin";
import Navbar from "./Components/Navbar/Navbar";
import PlacementForm from "./pages/PlacementInput";
import Training101 from "./pages/Training";
import ProtectedRoute from "./Components/ProtectedRoute";
import Admin from "./pages/AdminDashboard/AdminDashboard";
import PlacementStats from "./pages/Placement Graphs/PlacementStats";
import TrainingNames from "./pages/TrainingNamesController/TrainingNames";
import Footer from "./Components/Footer";
import EditProfile from "./pages/EditProfile/EditProfile";
import StudentData from "./pages/StudentData/StudentData";

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
            <Route path='/superadmin/trainingNames' element={<ProtectedRoute path="/superadmin/trainingNames" component={TrainingNames} />} />
            <Route path='/superadmin/studentData' element={<ProtectedRoute path="/superadmin/studentData" component={TrainingNames} />} />
            <Route path='/admin/editProfile' element={<ProtectedRoute path="/admin/editProfile" component={EditProfile} />} />
       
            <Route path='/tr' element={<ProtectedRoute path="/tr" component={Training101} />} />
            <Route path="/superadmin" element={<ProtectedRoute path="/superadmin" component={SuperAdminForm} />} />
            <Route path="/superadmin/placementStats" element={<ProtectedRoute path="/superadmin/placementStats" component={PlacementStats} />} />
            <Route path="/admin" element={<ProtectedRoute path="/admin" component={Admin} />} />
            <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" component={DashBoard} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
