import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import './SignUp.css';
import { auth, signUpWithEmail } from '../../auth/firebase';
import logo from '../resources/dropstick_logo.png';
import google from '../resources/google.png';
import facebook from '../resources/facebook.png';

declare global {
    interface Window {
        recaptchaWidgetId: any;
    }
}

const SignUp: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+380");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [pwdValid, setPwdValid] = useState(true);
    const [emailExists, setEmailExists] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
    const recaptchaContainerId = "recaptcha-container";
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);


    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setEmailExists(false);
        try {
            if (password === confirmPassword) {
                const userCredential = await signUpWithEmail(email, password);
                const user = userCredential.user;
                console.log('User signed up: ', user);
            } else {
                alert('Passwords do not match!');
            }
        } catch (error: any) {
            console.error('Error signing up with email and password', error);
            if (error.code === "auth/email-already-in-use") {
                setEmailExists(true);
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue.length >= 4) {
            setPhoneNumber(newValue);
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPwd = event.target.value;
        setPassword(newPwd);
        setPwdValid(newPwd.length >= 6);
        setPasswordMatch(newPwd === confirmPassword);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setPasswordMatch(password === event.target.value);
    };



    const handlePhoneNumberVerification = async () => {
        try {
            if (recaptchaContainerRef.current) {
                const recaptchaVerifierInstance = new RecaptchaVerifier(recaptchaContainerId, {}, getAuth());
                setRecaptchaVerifier(recaptchaVerifierInstance);
                recaptchaVerifierInstance.render().then(function (widgetId) {
                    window.recaptchaWidgetId = widgetId;
                });

                const result = await signInWithPhoneNumber(getAuth(), phoneNumber, recaptchaVerifierInstance);
                setConfirmResult(result);

                recaptchaVerifierInstance.clear();
                setRecaptchaVerifier(null);
            }
        } catch (error) {
            console.error("Error verifying phone number", error);
        }
    };

    const handleVerificationCodeSubmit = async () => {
        if (!confirmResult) {
            console.error("Phone number verification has not been initiated.");
            return;
        }

        try {
            const userCredential = await confirmResult.confirm(verificationCode);
            console.log("Phone number has been verified.", userCredential);
        } catch (error) {
            console.error("Error confirming verification code", error);
        }
    };


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
        <>
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Icon description" className="header-logo" />
                    </Link>
                </div>
            </header>
            <div className='signup-block'>
                <form onSubmit={handleSignUp} className='signup-box'>
                    <div className='signup-form'>
                        <div className='signup-question-item'>
                            <label className="signup-question-label">Name:</label>
                            <div className="signup-input-container">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="user-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='signup-question-item'>
                            <label className="signup-question-label">Email:</label>
                            <div className="signup-input-container">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="user-input"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        setEmailExists(false);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        {emailExists && <label className="pwd-warning">User with this email already registered!</label>}
                        <div className='signup-question-item'>
                            <label className="signup-question-label">Password:</label>
                            <div className="signup-input-container">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="user-input"
                                    value={password}
                                    onChange={e => {
                                        handlePasswordChange(e);
                                        setPasswordMatch(e.target.value === confirmPassword);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        {!pwdValid && <label className="pwd-warning">Password must be at least 6 characters long!</label>}
                        <div className='signup-question-item'>
                            <label className="signup-question-label">Confirm Password:</label>
                            <div className="signup-input-container">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="user-input"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                            </div>
                            {!passwordMatch && <label className="pwd-warning">Passwords do not match!</label>}
                        </div>
                        <div className='signup-question-item'>
                            <label className="signup-question-label">Phone Number:</label>
                            <div className="signup-input-container">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="user-input"
                                    value={phoneNumber}
                                    onChange={handleInputChange}
                                    pattern="\+380\d{9}" // phone number pattern validation
                                    required
                                />
                                <button type="button" onClick={handlePhoneNumberVerification}>Verify</button>
                            </div>
                        </div>
                        {confirmResult && (
                            <div className='signup-question-item'>
                                <label className="signup-question-label">Verification Code:</label>
                                <div className="signup-input-container">
                                    <input
                                        type="text"
                                        placeholder="Verification Code"
                                        className="user-input"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <button type="button" onClick={handleVerificationCodeSubmit}>Submit</button>
                                </div>
                            </div>
                        )}
                        <div className='signup-question-item'>
                            <div className="signup-input-container">
                                <button type="submit" className="signup-button">Sign Up</button>
                            </div>
                        </div>
                        <hr className="signup-divider" />
                        <div className='signup-social-row'>
                            <button className="signup-social-button" onClick={() => handleSocialLogin("google")}>
                                <img src={google} alt="Google sign-in" />
                            </button>
                            <button className="signup-social-button" onClick={() => handleSocialLogin("facebook")}>
                                <img src={facebook} alt="Facebook sign-in" />
                            </button>
                        </div>
                    </div>
                    <div id={recaptchaContainerId} ref={recaptchaContainerRef} className="captcha-container"></div>
                </form>
            </div>
        </>
    );
};

export default SignUp;
