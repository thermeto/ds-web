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

const App: FC = () => {
  const [user, setUser] = useState<{firebaseUser: User | null, phoneNumber: string | null}>({ firebaseUser: null, phoneNumber: null });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid); // Make sure your getUser function fits this usage
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
  );
};

export default App;
