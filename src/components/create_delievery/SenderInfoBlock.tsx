// SenderInfoBlock.tsx
import React, { useState, FC, ChangeEvent, useEffect, useRef } from "react";
import "./CreateDelievery.css";
import { useUserContext } from '../../contexts/UserContext';
import { ConfirmationResult } from "firebase/auth";


interface SenderInfoBlockProps {
    onVerify: (phoneNumber: string) => Promise<ConfirmationResult>;
    showRecaptcha: (show: boolean) => void;
}

const SenderInfoBlock: FC<SenderInfoBlockProps> = ({ onVerify, showRecaptcha }) => {
    const { user } = useUserContext(); // retrieve the user from your context

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "+380"); // if user has a phone number, use it as default
    const [isUpdating, setIsUpdating] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

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
        const result = await onVerify(phoneNumber); // Pass the updated phoneNumber to the onVerify function
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
                            className="sender-phone-input"
                            placeholder="Phone"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            style={{ borderColor: isPhoneNumberValid() ? "" : "red" }}
                            readOnly={!isUpdating}
                        />
                        {isUpdating
                            ? <button onClick={handleVerifyButtonClick}>Verify</button>
                            : <button onClick={handleUpdateButtonClick}>Update</button>
                        }
                    </div>
                    {/* {isVerifying && ( */}
                    { true && (
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
                                <button type="button" onClick={handleVerificationCodeSubmit}>Submit</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SenderInfoBlock;
