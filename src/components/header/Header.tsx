import React, { useState } from 'react';
import './Header.css';
import logo from '../resources/dropstick_logo.png';
import google from '../resources/google.png';
import facebook from '../resources/facebook.png';

const Header: React.FC = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here...
    }

    const handleSocialLogin = (platform: string) => {
        // Handle social login logic here...
        switch (platform) {
            case 'google':
                console.log('Google login initiated');
                break;
            case 'facebook':
                console.log('Facebook login initiated');
                break;
            default:
                console.log('Invalid platform');
        }
    }

    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Icon description" className="header-logo" />
            </div>
            <div className="options">
                <div>
                    <button
                        className={`login-button ${showLoginForm ? 'active' : ''}`}
                        onClick={() => setShowLoginForm(!showLoginForm)}
                    >
                        Log in
                    </button>
                    <button className="get-started-button">Get started</button>
                </div>
                {showLoginForm && (
                    <div className="login-form">
                        <form onSubmit={handleLogin}>
                            <div className="input-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="input-row">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
                            </div>
                            <div className="input-row">
                                <button type="submit" className='login-form-button'>Log in</button>
                            </div>
                            <div className="signup-row">
                                <h3 className='info-text'>
                                    New to DropStick? <a href="/signup" className="signup-link">Sign Up</a>
                                </h3>
                            </div>
                            <hr className="divider" />
                            <div className='social-row'>
                                <button className="social-button" onClick={() => handleSocialLogin("google")}>
                                    <img src={google} alt="Google sign-in" />
                                </button>
                                <button className="social-button" onClick={() => handleSocialLogin("facebook")}>
                                    <img src={facebook} alt="Facebook sign-in" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
