
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tomato-8b46f.firebaseapp.com",
  projectId: "tomato-8b46f",
  storageBucket: "tomato-8b46f.firebasestorage.app",
  messagingSenderId: "827019164424",
  appId: "1:827019164424:web:5755c58e3b588ae43a0abd",
  measurementId: "G-VHDB9EMV7Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider=new GoogleAuthProvider()

export {auth,googleProvider}