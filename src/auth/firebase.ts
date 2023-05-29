import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
export const signInWithGoogle = () => signInWithPopup(auth, provider);
