import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import './Header.css';
import logo from '../resources/dropstick_logo.png';
import google from '../resources/google.png';
import facebook from '../resources/facebook.png';
import { signInWithGoogle } from '../../auth/firebase';



const Header: React.FC = () => {
    const { user } = useUserContext();
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
                signInWithGoogle().then((result) => {
                    console.log(result.user)
                    // Handle the result here, it will contain the user information.
                }).catch((error) => {
                    // Handle errors here.
                    console.error(error);
                });
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
                <Link to="/">
                    <img src={logo} alt="Icon description" className="header-logo" />
                </Link>
            </div>
            <div className="options">
                <div>
                    {user ? (
                        <button
                            className={`login-button`}
                            // onClick={() => /* redirect to profile page logic here */}
                        >
                            Profile
                        </button>
                    ) : (
                        <>
                            <button
                                className={`login-button ${showLoginForm ? 'active' : ''}`}
                                onClick={() => setShowLoginForm(!showLoginForm)}
                            >
                                Log in
                            </button>
                            <button className="get-started-button">Get started</button>
                        </>
                    )}
                    <button className="get-started-button">Get started</button>
                </div>
                {showLoginForm && (
                    <div className="login-form">
                        <form onSubmit={handleLogin} className='form'>
                            <div className="header-input-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="header-input-row">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
                            </div>
                            <div className="header-button-row">
                                <button type="submit" className='login-form-button'>Log in</button>
                            </div>
                            <div className="signup-row">
                                <h3 className='info-text'>
                                    New to DropStick? <Link to="/signup" className="signup-link">Sign Up</Link>
                                </h3>
                            </div>
                            <hr className="login-divider" />
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
