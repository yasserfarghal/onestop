import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqohEoW-UD69TtfWuYrsqNnV3-2Cu8lQE",
  authDomain: "tagline-c8a58.firebaseapp.com",
  projectId: "tagline-c8a58",
  storageBucket: "tagline-c8a58.appspot.com",
  messagingSenderId: "994993578345",
  appId: "1:994993578345:web:356f621af618d25f9d5df8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app) 
export const googleProvider = new GoogleAuthProvider(app) 

