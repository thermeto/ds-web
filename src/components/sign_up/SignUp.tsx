import React, { useState } from 'react';
import './SignUp.css';
import logo from '../resources/dropstick_logo.png';

const SignUp: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+380");
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue.length >= 4) {
            setPhoneNumber(newValue);
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordMatch(event.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setPasswordMatch(password === event.target.value);
    };

    return (
        <>
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Icon description" className="header-logo" />
                </div>
            </header>
            <div className='signup-block'>
                <div className='signup-box'>
                    <div className='signup-form'>
                        <div className='question-item'>
                            <label className="question-label">Name:</label>
                            <div className="input-container">
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
                        <div className='question-item'>
                            <label className="question-label">Email:</label>
                            <div className="input-container">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="user-input"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='question-item'>
                            <label className="question-label">Password:</label>
                            <div className="input-container">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="user-input"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='question-item'>
                            <label className="question-label">Confirm Password:</label>
                            <div className="input-container">
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
                        <div className='question-item'>
                            <label className="question-label">Phone Number:</label>
                            <div className="input-container">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="user-input"
                                    value={phoneNumber}
                                    onChange={handleInputChange}
                                    pattern="\+380\d{9}" // phone number pattern validation
                                    required
                                />
                            </div>
                        </div>
                        <div className='question-item'>
                            <div className="input-container">
                                <button type="submit" className="signup-button">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
