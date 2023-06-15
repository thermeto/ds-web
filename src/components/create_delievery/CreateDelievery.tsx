import React, { FC, useState, useRef, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useUserContext } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import Map from "./Map";
import "./CreateDelievery.css";
import WhatBlock from "./WhatBlock";
import WhereBlock from "./WhereBlock";
import WhenBlock from "./WhenBlock";
import ReceiverInfoBlock from "./ReceiverInfoBlock"
import SenderInfoBlock from "./SenderInfoBlock"
import Header from '../header/Header';

declare global {
  interface Window {
    recaptchaWidgetId: any;
  }
}


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

declare const grecaptcha: any;

const CreateDelievery: FC = () => {
  const { user } = useUserContext();
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: "", length: "", height: "" });
  const [weight, setWeight] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);

  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaContainerId = "recaptcha-container";
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVisible, setRecaptchaVisible] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  const showRecaptcha = (show: boolean) => {
    if (show) {
      if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(recaptchaContainerId, {}, getAuth());
        recaptchaVerifierRef.current.render().then(function (widgetId: number) {
          window.recaptchaWidgetId = widgetId;
          setRecaptchaWidgetId(widgetId);
        });
      }
      if (typeof grecaptcha !== "undefined" && recaptchaWidgetId !== null) {
        grecaptcha.reset(recaptchaWidgetId);
      }
    } else if (recaptchaContainerRef.current) {
      recaptchaContainerRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    if (recaptchaWidgetId !== null && recaptchaContainerRef.current) {
      recaptchaContainerRef.current.style.display = 'block';
    }
  }, [recaptchaWidgetId]);


  const handleVerify = async (phoneNumber: string) => {
    try {
      if (recaptchaVerifierRef.current) {
        const result = await signInWithPhoneNumber(getAuth(), phoneNumber, recaptchaVerifierRef.current);
        setConfirmResult(result);
        showRecaptcha(false); // Hide the reCAPTCHA
      }
    } catch (error) {
      console.error("Error verifying phone number", error);
      showRecaptcha(true); // Show the reCAPTCHA
    }
  };


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
    <>
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
              <hr className="divider" />
              <div className="when-block-wrapper">
                <ReceiverInfoBlock />
              </div>
              <hr className="divider" />
              <div className="when-block-wrapper">
                <SenderInfoBlock onVerify={handleVerify} showRecaptcha={showRecaptcha} />
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
      <div id={recaptchaContainerId} ref={recaptchaContainerRef} className="captcha-container"></div>
    </>
  );
};




export default CreateDelievery;
