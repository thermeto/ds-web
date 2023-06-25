import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import './SignUp.css';
import { auth, signUpWithEmail, signInWithGoogle } from '../../auth/firebase';
import { DsUser } from '../../models/DsUser';
import { storeUserOnServer } from '../../api/UserApi'


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
    const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [pwdValid, setPwdValid] = useState(true);
    const [emailExists, setEmailExists] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [numberIsVerified, setNumberIsVerified] = useState(false);

    const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
    const recaptchaContainerId = "recaptcha-container";
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);


    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        signUpWithEmail(email, password).then((userCredential) => {
            if (userCredential.user) {
                const user: DsUser = {
                    email: email,
                    phoneNumber: verifiedPhoneNumber,
                    name: name
                }
                userCredential.user.getIdToken().then((token) => {
                    storeUserOnServer(user, token).catch((error) => {
                        console.error("Failed to store user on server:", error);
                    });
                }).catch((error) => {
                    console.error("Failed to get user token:", error);
                });
            }
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            if (errorCode === 'auth/weak-password') {
                alert('The password is too weak.');
            } else if (errorCode === 'auth/email-already-in-use') {
                alert('The email address is already in use by another account.');
            } else {
                alert(errorMessage);
            }
        })
    }
    

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

                if (recaptchaContainerRef.current) {
                    recaptchaContainerRef.current.style.display = 'none';
                }
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
            setConfirmResult(null);
            setNumberIsVerified(true)
            setVerifiedPhoneNumber(phoneNumber)
        } catch (error) {
            console.error("Error confirming verification code", error);
        }
    };


    const handleSocialLogin = (platform: string) => {
        // Handle social login logic here...
        switch (platform) {
            case 'google':
                console.log('Google login initiated');
                signInWithGoogle().catch((error) => {
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
        <>
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Icon description" className="header-logo" />
                    </Link>
                </div>
            </header>
            <div className='signup-window'>
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
                                    className={`number-input ${numberIsVerified ? "number-verified" : ""}`}
                                    value={phoneNumber}
                                    onChange={handleInputChange}
                                    pattern="\+380\d{9}"
                                    required
                                />
                                <button type="button" className='verify-number-button' onClick={handlePhoneNumberVerification}>Verify</button>
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
