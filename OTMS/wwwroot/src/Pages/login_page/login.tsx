import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatusMessage('Logging in...');
        setStatusType('');

        try {
            // 1. Matches api/authenticationController
            const response = await fetch('/api/authentication/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeNumber: employeeId,
                    password: password,
                }),
            });

            // 2. Parse the response from your updated TokenResponseDTO
            const data = await response.json();

            if (response.ok) {
                // Log the role to verify the backend is sending it
                console.log("Backend returned role:", data.role);

                // 3. Save to localStorage for PrivateRouter use
                localStorage.setItem('authToken', data.accessToken);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('employeeId', employeeId);

                // 4. Role-Based Redirection based on DB values
                // and folder names
                switch (data.role) {
                    case 'SuperAdmin':
                    case 'System Admin':
                        navigate('/SystemAdmin_Dashboard');
                        break;
                    case 'Operation Admin':
                    case 'OpAdmin':
                        navigate('/OpAdmin_Dashboard');
                        break;
                    case 'Employee':
                        navigate('/OpEmployee_Dashboard');
                        break;
                    default:
                        // If this runs, your DB string doesn't match the cases above
                        setStatusMessage(`Account role '${data.role}' has no dashboard.`);
                        setStatusType('error');
                        break;
                }
            } else {
                // Handle 400/401 errors from backend
                setStatusMessage(data || 'Invalid Employee ID or password.');
                setStatusType('error');
            }
        } catch (error) {
            // Handle network errors or server crashes
            setStatusMessage('Unable to reach the server. Please try again later.');
            setStatusType('error');
        }
    };

    return (
        <div className="login-page">
            {/* LEFT SIDE CONTENT (Taglines/Steps) */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="login-logo">
                        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>Speedex</h1>
                    </div>
                    <p className="login-tagline">COURIER & FORWARDER, INC.</p>
                    <div className="login-steps">
                        <div className="login-step">
                            <div className="login-step-number">1</div>
                            <div>
                                <strong>Enter Credentials</strong>
                                <p>Use your assigned Employee ID and password.</p>
                            </div>
                        </div>
                        <div className="login-step">
                            <div className="login-step-number">2</div>
                            <div>
                                <strong>Manage Deliveries</strong>
                                <p>Track and update delivery orders in real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE (The actual Form) */}
            <div className="login-right">
                <form className="login-form" onSubmit={handleSubmit}>
                    <span className="login-form-label" style={{ color: 'var(--primary)' }}>SECURE ACCESS</span>
                    <h2 className="login-form-title">Login to System</h2>
                    <p className="login-form-subtitle">Enter your credentials below to continue.</p>

                    <hr className="login-divider" />

                    {statusMessage && (
                        <div className={`login-alert ${statusType}`} style={{
                            background: statusType === 'error' ? '#FFF1F1' : '#F1FAF6',
                            border: `1px solid ${statusType === 'error' ? '#FFCDCD' : '#B7E1CB'}`,
                            color: statusType === 'error' ? '#E31A1A' : '#0F6B2E',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                        }}>
                            {statusMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Employee ID</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="EMP-001"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/forgotpassword_page" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-dark btn-lg login-submit-btn">
                        LOGIN TO DASHBOARD
                    </button>
                </form>

                <p className="login-footer">
                    © 2026 <a href="#">Speedex Courier & Forwarder, Inc.</a>
                </p>

                {/* Add the new links here */}
                <div className="additional-links" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate('/OpAdmin_Dashboard')}
                    >
                        OP Admin
                    </button>
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate('/OpEmployee_Dashboard')}
                    >
                        OP Employee
                    </button>

                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate('/SystemAdmin_Dashboard')}
                    >
                        System Admin
                    </button>
                </div>
            </div>
        </div>
    );
}