import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    // 1. If not logged in, send to Login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 2. If role doesn't match allowedRoles, redirect home
    if (!allowedRoles.includes(userRole || "")) {
        console.warn(`Access denied for role: ${userRole}`);
        return <Navigate to="/" replace />;
    }

    // 3. Authorized
    return <>{children}</>;
};

export default PrivateRoute;