import React, { useState, FC, ChangeEvent, useEffect, useRef } from "react";
import "./CreateDelievery.css";
import { useUserContext } from '../../contexts/UserContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, getAuth } from "firebase/auth";

const SenderInfoBlock: FC = () => {
    const { user } = useUserContext(); // retrieve the user from your context

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "+380"); // if user has a phone number, use it as default
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
    const [isRecaptchaVisible, setIsRecaptchaVisible] = useState(true);
    const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if(val.substring(0, 4) === "+380") {
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
    
        try {
            const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, getAuth());
            const result = await signInWithPhoneNumber(getAuth(), phoneNumber, recaptchaVerifier);
            setConfirmResult(result);
            if (recaptchaContainerRef.current) {
                recaptchaContainerRef.current.style.display = 'none';
            }
        } catch (error) {
            console.error("Error verifying phone number", error);
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
                            className="destination-input"
                            placeholder="Phone"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            style={{borderColor: isPhoneNumberValid() ? "" : "red"}}
                            readOnly={!isUpdating}
                        />
                        {isUpdating
                        ? <button onClick={handleVerifyButtonClick}>Verify</button>
                        : <button onClick={handleUpdateButtonClick}>Update</button>
                        }
                    </div>
                </div>
            </div>
            <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        </>
    );
};

export default SenderInfoBlock;
