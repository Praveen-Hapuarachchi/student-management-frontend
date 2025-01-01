import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, roles }) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        console.log('No token found, redirecting to login.');
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        console.log('Decoded Role:', userRole);
        
        // Check if the user's role matches any of the allowed roles
        if (roles.includes(userRole)) {
            console.log('Access granted for role:', userRole);
            return children;
        } else {
            console.warn('Unauthorized access attempt for role:', userRole);
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        console.error('Token decoding error:', error);
        localStorage.removeItem('jwtToken');
        return <Navigate to="/login" replace />;
    }
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;