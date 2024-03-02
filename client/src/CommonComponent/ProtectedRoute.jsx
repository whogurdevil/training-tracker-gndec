import React from 'react';
import { jwtDecode } from "jwt-decode";
import { Navigate } from 'react-router-dom';
import SuperAdmin from '../Components/SuperAdminDashboard/SuperAdmin';
import Admin from '../Components/AdminDashboard/AdminDashboard';
import Home from '../Components/Home';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const authToken = localStorage.getItem('authtoken');

    if (!authToken) {
        return <Navigate to="/login" replace />;
    } else {
        try {
            const decodedToken = jwtDecode(authToken);
            const userRole = decodedToken.user.role;
            console.log(userRole)

            // Check if the user is authenticated and has the required role
            if ( userRole === 'superadmin') {
                console.log(<SuperAdmin />)
                return <SuperAdmin />;
            } else if (userRole === 'admin'){
                return <Admin />;
            }else {
                // Redirect to home or another appropriate route if the user doesn't have the required role
                return <Home/>
            }
        } catch (error) {
            // If there's an error decoding the token, redirect to login
            console.error('Error decoding token:', error);
            return <Navigate to="/login" replace />;
        }
    }
};

export default ProtectedRoute;
