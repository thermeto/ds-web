import React, { FC, useState, useEffect } from "react";
import './CreateDelievery.css';

interface WhenBlockProps {
  duration: number;
}

const WhenBlock: FC<WhenBlockProps> = ({ duration }) => {
  const [sendDate, setSendDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const now = new Date();
  const localISOString = now.getFullYear() + "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
    ("0" + now.getDate()).slice(-2) + "T" +
    ("0" + now.getHours()).slice(-2) + ":" +
    ("0" + now.getMinutes()).slice(-2);

  useEffect(() => {
    setSendDate(localISOString);
    const arrivalTime = new Date(now.getTime() + duration * 1000);
    setArrivalDate(arrivalTime.toISOString().slice(0, 16));
  }, [duration, localISOString]);

  useEffect(() => {
    if (sendDate) {
      const sendDateTime = new Date(sendDate);
      const arrivalDateTime = new Date(sendDateTime.getTime() + duration * 1000);
      const timeZoneOffset = arrivalDateTime.getTimezoneOffset() * 60 * 1000;
      arrivalDateTime.setTime(arrivalDateTime.getTime() - timeZoneOffset);
      setArrivalDate(arrivalDateTime.toISOString().slice(0, 16));
    }
  }, [duration, sendDate]);



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSendDate = new Date(event.target.value);
    const newSendDateISOString = newSendDate.toISOString().slice(0, 16);
    const newArrivalDate = new Date(newSendDate.getTime() + duration * 1000);
    const newArrivalDateISOString = newArrivalDate.toISOString().slice(0, 16);
    setSendDate(newSendDateISOString);
    setArrivalDate(newArrivalDateISOString);
  };

  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 2);
  const maxDateISOString = maxDate.toISOString().slice(0, 16);

  return (
    <div className="when-block">
      <div className="date-input-block">
      <label className="question-label">Send: </label>
        <input type="datetime-local" className="send-arrive-dt-picker" value={sendDate} onChange={handleChange} min={localISOString} max={maxDateISOString} />
      </div>
      <div className="date-input-block">
      <label className="question-label">Arrival: </label>
        <input type="datetime-local" className="send-arrive-dt-picker" value={arrivalDate} readOnly />
      </div>
    </div>
  );
};

export default WhenBlock;