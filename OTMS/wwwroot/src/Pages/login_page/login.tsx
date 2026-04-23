import React, { useState } from 'react';
import './login.css';

export default function Login() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatusMessage('Logging in...');
        setStatusType('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeNumber: employeeId, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.accessToken ?? '');
                localStorage.setItem('refreshToken', data.refreshToken ?? '');
                localStorage.setItem('employeeId', employeeId);
                window.location.href = '/dashboard';
            } else {
                setStatusMessage(data || 'Invalid Employee ID or password.');
                setStatusType('error');
            }
        } catch {
            setStatusMessage('Unable to reach the server. Please try again later.');
            setStatusType('error');
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-left-content">
                    <div className="login-logo" style={{ background: 'transparent', padding: '0' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>Speedex</h1>
                    </div>
                    <p className="login-tagline">COURIER & FORWARDER, INC.</p>
                    <div className="login-steps">
                        <div className="login-step">
                            <div className="login-step-number">1</div>
                            <div>
                                <strong>Enter Credentials</strong>
                                <p>Use your assigned Employee ID and password to access the system.</p>
                            </div>
                        </div>
                        <div className="login-step">
                            <div className="login-step-number">2</div>
                            <div>
                                <strong>Manage Deliveries</strong>
                                <p>Track, assign, and update delivery orders in real-time.</p>
                            </div>
                        </div>
                        <div className="login-step">
                            <div className="login-step-number">3</div>
                            <div>
                                <strong>Monitor Performance</strong>
                                <p>View analytics and reports to optimize logistics operations.</p>
                            </div>
                        </div>
                    </div>
                    <div className="login-decorative-circles">
                        <div className="circle circle-1" />
                        <div className="circle circle-2" />
                    </div>
                </div>
            </div>

            <div className="login-right">
                <form className="login-form" onSubmit={handleSubmit}>
                    <span className="login-form-label label" style={{ color: 'var(--primary)' }}>SECURE ACCESS</span>
                    <h2 className="login-form-title">Login to System</h2>
                    <p className="login-form-subtitle">Enter your credentials below to continue.</p>

                    <hr className="login-divider" />

                    {statusMessage && (
                        <div
                            className={`login-alert ${statusType}`}
                            style={{
                                background: statusType === 'error' ? '#FFF1F1' : '#F1FAF6',
                                border: `1px solid ${statusType === 'error' ? '#FFCDCD' : '#B7E1CB'}`,
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                color: statusType === 'error' ? '#E31A1A' : '#0F6B2E',
                                fontSize: '14px',
                            }}
                        >
                            <p style={{ margin: 0 }}>{statusMessage}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Employee ID</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="EMP-001"
                            value={employeeId}
                            onChange={e => setEmployeeId(e.target.value)}
                            required
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                            Use your Employee ID as the username.
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-dark btn-lg login-submit-btn" id="login-btn">
                        LOGIN TO DASHBOARD
                    </button>
                </form>

                <p className="login-footer">© 2026 <a href="#">Speedex Courier & Forwarder, Inc.</a> · All rights reserved.</p>
            </div>
        </div>
    );
}