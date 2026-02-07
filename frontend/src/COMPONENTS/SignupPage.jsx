// src/COMPONENTS/SignupPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../STYLES/SignupPage.css";

export default function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false); // <-- 1. ADD NEW STATE

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed. Please try again.');
                return;
            }
            navigate('/login');
        } catch (err) {
            console.error('Signup request failed:', err);
            setError('Could not connect to the server. Please try again later.');
        }
    };

    return (
        <div
            className="login-overlay"
            onClick={() => navigate("/")}
            role="presentation"
        >
            <div
                className="login-container"
                role="dialog"
                aria-labelledby="signup-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="login-close-btn"
                    aria-label="Close"
                    onClick={() => navigate("/")}
                >
                    ×
                </button>

                <div className="login-header">
                    <div className="flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'var(--primary-green)' }}
                        >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <h1 id="signup-title" className="login-title">SpeedyFresh</h1>
                    </div>
                    <p className="login-subtitle">Your fresh groceries, delivered fast!</p>
                    <p className="login-welcome-message">Create your account to get started.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        {/* --- 2. WRAP INPUT AND BUTTON --- */}
                        <div className="password-wrapper">
                            <input
                                // --- 3. DYNAMIC INPUT TYPE ---
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            {/* --- 4. ADD THE TOGGLE BUTTON --- */}
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    // Eye-off icon
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    // Eye icon
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

                    <button type="submit" className="primary-login-button">Sign Up</button>
                </form>

                <p className="signup-text">
                    Already have an account? <Link to="/login" className="signup-link">Log in here</Link>
                </p>
            </div>
        </div>
    );
}