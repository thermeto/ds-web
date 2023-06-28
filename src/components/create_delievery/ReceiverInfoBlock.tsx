import React, { useState, FC, ChangeEvent } from "react";
import "./CreateDelievery.css";


interface Props {
    onNameChange: (name: string) => void;
    onVerifiedPhoneNumberChange: (phoneNumber: string) => void; 
}

const ReceiverInfoBlock: FC<Props> = ({onNameChange, onVerifiedPhoneNumberChange}) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+380");
    
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const regex = /^[a-zA-Z ]{0,30}$/; // only letters and space
        const val = event.target.value;
        if (val === '' || regex.test(val)) {
           setName(val);
           onNameChange(val);
        }
    };

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if(val.substring(0, 4) === "+380") {
            setPhoneNumber(val);
            onVerifiedPhoneNumberChange(val);
        }
    };

    const isNameValid = () => {
        return name.replace(/\s/g,'').length >= 4;
    };

    const isPhoneNumberValid = () => {
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
