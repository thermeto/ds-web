// src/components/profile/Profile.tsx
import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../auth/firebase';
import { signOut } from "firebase/auth";
import { useUserContext } from '../../contexts/UserContext';
import './Profile.css';
import Header from '../header/Header';


const Profile: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { user, setUser } = useUserContext(); 
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          setUser({ firebaseUser: null, phoneNumber: null });  // set user state to null
          console.log("User signed out successfully");
          console.log(user);  
          navigate('/');
        } catch (error) {
          console.error("Failed to sign out", error);
        }
      };
    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="profile-category-container">
                    <button className="profile-category-button" onClick={() => setSelectedCategory('Personal Info')}>Personal Info</button>
                    <button className="profile-category-button" onClick={() => setSelectedCategory('Security')}>Security</button>
                    <button className="profile-category-button" onClick={() => setSelectedCategory('Preferences')}>Preferences</button>
                    <hr />
                    <button className="profile-signout-button" onClick={handleSignOut}>Sign Out</button>
                </div>

                <div className="profile-form-container">
                    {selectedCategory && (
                        <>
                            <h1>{selectedCategory}</h1>
                            <form>
                                {/* Your form goes here. */}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>

    );
};

export default Profile;