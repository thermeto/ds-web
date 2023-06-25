// src/components/create_delievery/SenderInfoBlock.tsx
import React, { useState, FC, ChangeEvent, useEffect } from "react";
import "./CreateDelievery.css";
import { useUserContext } from '../../contexts/UserContext';
import { ConfirmationResult } from "firebase/auth";


interface SenderInfoBlockProps {
    onVerify: (phoneNumber: string) => Promise<ConfirmationResult>;
    showRecaptcha: (show: boolean) => void;
}

const SenderInfoBlock: FC<SenderInfoBlockProps> = ({ onVerify, showRecaptcha }) => {
    const { user } = useUserContext();

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "+380"); 
    const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(""); 
    const [isUpdating, setIsUpdating] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [numberIsVerified, setNumberIsVerified] = useState(false);

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (val.substring(0, 4) === "+380") {
            setPhoneNumber(val);
        }
    };

    const isPhoneNumberValid = () => {
        // check phone number length (should be exactly 13 symbols)
        return phoneNumber.length === 13;
    };

    // Effect to update the phone number if user data changes
    useEffect(() => {
        setPhoneNumber(user?.phoneNumber || "+380");
    }, [user]);

    const handleUpdateButtonClick = () => {
        setIsUpdating(true);
    };

    const handleVerifyButtonClick = async () => {
        if (!isPhoneNumberValid()) return;
        showRecaptcha(true);
        const result = await onVerify(phoneNumber); 
        setConfirmResult(result);
        setIsVerifying(true);
    };

    const handleVerificationCodeSubmit = async () => {
        if (!confirmResult) {
            console.error("Phone number verification has not been initiated.");
            return;
        }

        try {
            const userCredential = await confirmResult.confirm(verificationCode);
            console.log("Phone number has been verified.", userCredential);
            setIsVerifying(false);
            setConfirmResult(null);
            setVerificationCode("");
            setNumberIsVerified(true)
            setVerifiedPhoneNumber(phoneNumber)
        } catch (error) {
            console.error("Error confirming verification code", error);
        }
    };

    return (
        <>
            <div className="question-item">
                <div>
                    <label className="question-label">Sender info:</label>
                </div>
                <div className="fromto-container">
                    <div className="from-container">
                        <label className="question-label">Phone: </label>
                        <input
                            className={`sender-phone-input ${numberIsVerified ? "sender-number-verified" : ""}`}
                            placeholder="Phone"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            style={{ borderColor: isPhoneNumberValid() ? "" : "red" }}
                            readOnly={!isUpdating}
                        />
                        {isUpdating
                            ? <button className='verify-sender-number-button' onClick={handleVerifyButtonClick}>Verify</button>
                            : <button className='verify-sender-number-button' onClick={handleUpdateButtonClick}>Update</button>
                        }
                    </div>
                    {/* isVerifying */}
                    { isVerifying && ( 
                        <>
                            <label className="verification-code-label">Verification Code:</label>
                            <div className="verification-code-container">
                                <input
                                    type="text"
                                    placeholder="Verification Code"
                                    className="verification-user-input"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button className="verify-sender-number-button" type="button" onClick={handleVerificationCodeSubmit}>Submit</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SenderInfoBlock;
