import React, { FC, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useUserContext } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Map from "./Map";
import "./CreateDelievery.css";
import WhatBlock from "./WhatBlock";
import WhereBlock from "./WhereBlock";
import WhenBlock from "./WhenBlock";
import Header from '../header/Header';

const initialFeatures = [
  { text: "#brittle", isSelected: false },
  { text: "#food", isSelected: false },
  { text: "#orientation important", isSelected: false },
];

interface Feature {
  text: string;
  isSelected: boolean;
}

interface Dimensions {
  width: string;
  length: string;
  height: string;
}

const GOOGLE_API_KEY: string = process.env.REACT_APP_GOOGLE_MAPS_TOKEN || '';

const CreateDelievery: FC = () => {
  const { user } = useUserContext();
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: "", length: "", height: "" });
  const [weight, setWeight] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);

  if (!user) {
    return <Navigate to="/signup" replace />
  }

  const handleOriginSelect = (position: { lat: number; lng: number }) => {
    setOrigin(position);
  };

  const handleDestinationSelect = (position: { lat: number; lng: number }) => {
    setDestination(position);
  };

  const handleSubmit = async () => {
    try {
      // const response = await fetch('YOUR_BACKEND_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // body: JSON.stringify({
      //   origin,
      //   destination,
      //   distance,
      //   duration,
      //   dimensions,
      //   weight,
      //   features
      // })
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();

      // Handle response data here
      console.log(JSON.stringify({
        origin,
        destination,
        distance,
        duration,
        dimensions,
        weight,
        features
      }));

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_API_KEY}
      libraries={["places"]}
      onLoad={() => console.log("Google Maps API script loaded")}
      onError={(error) => console.error("Error loading Google Maps API script:", error)}
    >
      <Header />
      <div className="delivery-page">
        <form className="delivery-wrapper" onSubmit={handleSubmit}>
          <div className="menu-container">
            <h2>Please provide shipment details:</h2>
            <div className="what-block-wrapper">
              <WhatBlock
                initialFeatures={initialFeatures}
                onDimensionsChange={setDimensions}
                onWeightChange={setWeight}
                onFeaturesChange={setFeatures}
              />
            </div>
            <hr className="divider" />
            <div className="where-block-wrapper">
              <WhereBlock
                onOriginSelect={handleOriginSelect}
                onDestinationSelect={handleDestinationSelect}
                distance={distance}
                duration={duration}
              />
            </div>
            <hr className="divider" />
            <div className="when-block-wrapper">
              <WhenBlock duration={duration} />
            </div>
            <button type="submit">Submit</button>
          </div>
          <div className="map-container">
            <Map
              origin={origin}
              destination={destination}
              onDistanceChange={setDistance}
              onDurationChange={setDuration}
            />
          </div>
        </form>
      </div>
    </LoadScript>
  );
};




export default CreateDelievery;
