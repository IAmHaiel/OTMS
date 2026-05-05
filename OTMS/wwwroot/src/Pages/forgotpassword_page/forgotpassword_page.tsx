import React, { useState } from 'react';
import './forgotpassword_page.css';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSendCode = () => {
        setStatusMessage('Sending verification code...');
        setTimeout(() => {
            setStep('otp');
            setStatusMessage('Verification code sent to your email.');
        }, 1000);
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
    };

    const handleVerify = () => {
        setStatusMessage('Verifying code...');
        // TODO: API call
    };

    return (
        <div className="forgot-page">

            {/* LEFT SIDE (same feel as login) */}
            <div className="forgot-left">
                <div className="overlay">
                    <h1>Speedex</h1>
                    <p>Courier & Forwarder, Inc.</p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="forgot-right">
                <div className="forgot-form">

                    <h2>Forgot Password</h2>
                    <p className="subtitle">Recover your account securely</p>

                    {statusMessage && (
                        <div className="status-message">{statusMessage}</div>
                    )}

                    {/* STEP 1 */}
                    {step === 'email' && (
                        <>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <button className="primary-btn" onClick={handleSendCode}>
                                Send Verification Code →
                            </button>
                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 'otp' && (
                        <>
                            <label>Enter OTP</label>

                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                    />
                                ))}
                            </div>

                            <button className="primary-btn" onClick={handleVerify}>
                                Verify Code
                            </button>
                        </>
                    )}

                    <p className="back-login">
                        Already have an account? <Link to="/">Login here</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}