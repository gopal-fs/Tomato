import React from 'react'
import Navbar from './Navbar'
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../configs/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const ErrorPage = () => {
  const url=import.meta.env.VITE_BASE_URL
  const doSignInGoogle = async (e) => {
    if (e) e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const new_user = {
        user_id: user.uid,
        user_profile: user.photoURL,
        user_name: user.displayName,
        user_email: user.email,
        user_cart: []
      };
      const res = await axios.post(`${url}/addUser`, new_user);
      toast.success(res.data);
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <>
      <Navbar doSignInGoogle={doSignInGoogle}/>
      <div className='error-page'>
      
      <h1>404 Not Found</h1>
    </div>

    </>
   
  )
}

export default ErrorPage