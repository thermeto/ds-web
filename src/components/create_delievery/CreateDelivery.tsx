// src/components/create_delievery/CreateDelivery.tsx
import React, { FC, useState, useRef, useEffect } from "react";
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
import { DeliveryOrderDto } from '../../models/DeliveryOrderDto'; 
import { postDeliveryOrder } from '../../api/DeliveryApi'; 
import { getIdToken } from "firebase/auth"; 

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

declare const grecaptcha: any;

const CreateDelivery: FC = () => {
  const { user } = useUserContext();
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: "", length: "", height: "" });
  const [weight, setWeight] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [senderPhoneNumber, setSenderPhoneNumber] = useState<string>("");
  const [receiverPhoneNumber, setreceiverPhoneNumber] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaContainerId = "recaptcha-container";
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  const showRecaptcha = (show: boolean) => {
    if (show) {
      if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(recaptchaContainerId, {}, getAuth());
        recaptchaVerifierRef.current.render().then(function (widgetId: number) {
          window.recaptchaWidgetId = widgetId;
          setRecaptchaWidgetId(widgetId);
        }).catch((error) => console.error("Error rendering reCAPTCHA", error));
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


  const handleVerify = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (recaptchaVerifierRef.current) {
      try {
        const result = await signInWithPhoneNumber(getAuth(), phoneNumber, recaptchaVerifierRef.current);
        showRecaptcha(false);
        setConfirmResult(result);
        return result;
      } catch (error) {
        console.error("Error verifying phone number", error);
        showRecaptcha(true);
        throw error;
      }
    }
    throw new Error("RecaptchaVerifier reference is not set.");
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const deliveryOrder: DeliveryOrderDto = {
      origin: {
        lat: origin?.lat || 0,
        lng: origin?.lng || 0
      },
      destination: {
        lat: destination?.lat || 0,
        lng: destination?.lng || 0
      },
      distance,
      duration,
      dimensions,
      weight,
      packageFeatures: features.filter((feature) => feature.isSelected).map((feature) => feature.text.substring(1)).join(','),
      receiverName,
      receiverPhoneNumber,
      comments,
    };
  
    if (user?.firebaseUser) {
      const token = await getIdToken(user.firebaseUser);
  
      try {
        await postDeliveryOrder(deliveryOrder, token);
        console.log("Delivery order has been sent to the server");
      } catch (error) {
        console.error("Error posting order on the server", error);
      }
    } else {
      console.error("No user found");
    }
  };
  

  return (
    <>
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
                onFeaturesChange={newFeature => {setFeatures(newFeature)}
                }
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
              <ReceiverInfoBlock
                onVerifiedPhoneNumberChange={newPhoneNumber => {setreceiverPhoneNumber(newPhoneNumber)}}
                onNameChange={newName => {setReceiverName(newName)}}
              />
            </div>
            <hr className="divider" />
            <div className="when-block-wrapper">
              <SenderInfoBlock onVerify={handleVerify} showRecaptcha={showRecaptcha}
                onVerifiedPhoneNumberChange={newPhoneNumber => {setSenderPhoneNumber(newPhoneNumber)}} />
            </div>
            <hr className="divider" />
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
      <div id={recaptchaContainerId} ref={recaptchaContainerRef} className="captcha-container"></div>
    </>
  );
};




export default CreateDelivery;
