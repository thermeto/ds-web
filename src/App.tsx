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


const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    }
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
