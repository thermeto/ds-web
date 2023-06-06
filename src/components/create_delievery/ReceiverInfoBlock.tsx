import React, { useState, FC, ChangeEvent } from "react";
import "./CreateDelievery.css";

const ReceiverInfoBlock: FC = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+380");
    
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const regex = /^[a-zA-Z ]{0,30}$/; // only letters and space
        if (event.target.value === '' || regex.test(event.target.value)) {
           setName(event.target.value);
        }
    };

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if(val.substring(0, 4) === "+380") {
            setPhoneNumber(val);
        }
    };

    const isNameValid = () => {
        // check name length (not counting spaces)
        return name.replace(/\s/g,'').length >= 4;
    };

    const isPhoneNumberValid = () => {
        // check phone number length (should be exactly 13 symbols)
        return phoneNumber.length === 13;
    };

    return (
        <>
            <div className="question-item">
                <div>
                    <label className="question-label">Receiver info:</label>
                </div>
                <div className="fromto-container">
                    <div className="from-container">
                        <label className="question-label">Name: </label>
                        <input
                            className="destination-input"
                            placeholder="Name"
                            value={name}
                            onChange={handleNameChange}
                            style={{borderColor: isNameValid() ? "" : "red"}}
                        />
                    </div>
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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReceiverInfoBlock;
