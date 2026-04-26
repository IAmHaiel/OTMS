import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LoginPage from './Pages/login_page/login'
import SystemAdmin_Dashboard from './Pages/SystemAdmin_Dashboard/SystemAdmin_Dashboard'
import ForgotPasswordPage from './Pages/forgotpassword_page/forgotpassword_page';
import OpAdmin_Dashboard from './Pages/OpAdmin_Dashboard/OpAdmin_Dashboard';
import OpEmployee_Dashboard from './Pages/OpEmployee_Dashboard/OpEmployee_Dashboard';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('authToken');
    return token ? <>{children}</> : <Navigate to="/" replace />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/forgotpassword_page" element={<ForgotPasswordPage />} />

                <Route path="/SystemAdmin_Dashboard" element={
                    <PrivateRoute>
                        <SystemAdmin_Dashboard />
                    </PrivateRoute> 
                } />
                <Route path="/OpAdmin_Dashboard" element={
                    <PrivateRoute>
                        <OpAdmin_Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/OpEmployee_Dashboard" element={
                    <PrivateRoute>
                        <OpEmployee_Dashboard />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)