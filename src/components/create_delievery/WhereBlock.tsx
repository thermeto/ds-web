import React, { FC } from "react";
import "./CreateDelievery.css";
import PlacesAutocomplete from "./AutocompleteInput";

interface WhereBlockProps {
  onOriginSelect: (position: { lat: number; lng: number }) => void;
  onDestinationSelect: (position: { lat: number; lng: number }) => void;
  distance: number;
  duration: number;
}

const WhereBlock: FC<WhereBlockProps> = ({
  onOriginSelect,
  onDestinationSelect,
  distance,
  duration,
}) => {
  return (
    <>
      <div className="fromto-container">
        <div className="from-container">
          <label className="question-label">From: </label>
          <PlacesAutocomplete
            className="destination-input"
            placeholder="From"
            onSelect={onOriginSelect}
          />
        </div>

        <div className="to-container">
          <label className="question-label">To: </label>
          <PlacesAutocomplete
            className="destination-input"
            placeholder="To"
            onSelect={onDestinationSelect}
          />
        </div>
      </div>
      <div className="info-container">
        <span className="info-label">Distance: {(distance / 1000).toFixed(1)} km</span>
        <span className="info-label">Duration: {Math.round(duration / 60)} min</span>
      </div>
    </>
  );
};

export default WhereBlock;
