import React, { FC, useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CreateDelievery from './components/create_delievery/CreateDelievery';
import Main from './components/main/Main';
import SignUp from './components/sign_up/SignUp';
import Profile from './components/profile/Profile';
import { auth } from './auth/firebase';
import { User } from 'firebase/auth';
import { getUser } from './api/UserApi';
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_API_KEY: string = process.env.REACT_APP_GOOGLE_MAPS_TOKEN || '';
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const App: FC = () => {
  const [user, setUser] = useState<{firebaseUser: User | null, phoneNumber: string | null}>({ firebaseUser: null, phoneNumber: null });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(); 
        const userData = await getUser(token); 
        setUser({ firebaseUser, phoneNumber: userData ? (userData.phoneNumber ? userData.phoneNumber : null) : null });
      } else {
        setUser({ firebaseUser: null, phoneNumber: null });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LoadScript
        googleMapsApiKey={GOOGLE_API_KEY}
        libraries={libraries}
        onLoad={() => console.log("Google Maps API script loaded")}
        onError={(error) => console.error("Error loading Google Maps API script:", error)}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/create-delivery" element={<CreateDelievery />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </LoadScript>
  );
};

export default App;
