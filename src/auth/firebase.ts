// src/auth/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { DsUser } from '../models/DsUser';
import { getUser, storeUserOnServer } from '../api/UserApi';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_TOKEN,
  authDomain: "delievery-project.firebaseapp.com",
  projectId: "delievery-project",
  storageBucket: "delievery-project.appspot.com",
  messagingSenderId: "321123823781",
  appId: "1:321123823781:web:8a5314d8c33afc2de59d4c",
  measurementId: "G-KEMRZE9FEK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () =>
  signInWithPopup(auth, provider)
    .then(handleUser)
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error: ${errorCode}, Message: ${errorMessage}`);
    });

export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);


const handleUser = async (userCredential: UserCredential) => {
  const firebaseUser = userCredential.user;
  const token = await firebaseUser.getIdToken();

  const dsUser = await getUser(token);
  console.log("const dsUser = await getUser(token): " + dsUser)
  if (!dsUser) {
    const userToStore: DsUser = {
      name: firebaseUser.displayName || "",
      email: firebaseUser.email || ""
    };
    await storeUserOnServer(userToStore, token);
  }
};