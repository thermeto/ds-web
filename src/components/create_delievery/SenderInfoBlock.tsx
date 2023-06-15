// SenderInfoBlock.tsx
import React, { useState, FC, ChangeEvent, useEffect, useRef } from "react";
import "./CreateDelievery.css";
import { useUserContext } from '../../contexts/UserContext';

interface SenderInfoBlockProps {
    onVerify: (phoneNumber: string) => void;
    showRecaptcha: (show: boolean) => void;
  }

  const SenderInfoBlock: FC<SenderInfoBlockProps> = ({onVerify, showRecaptcha}) => {
    const { user } = useUserContext(); // retrieve the user from your context

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "+380"); // if user has a phone number, use it as default
    const [isUpdating, setIsUpdating] = useState(false);

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
        showRecaptcha(true);
        onVerify(phoneNumber); // Pass the updated phoneNumber to the onVerify function
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
        </>
    );
};

export default SenderInfoBlock;
