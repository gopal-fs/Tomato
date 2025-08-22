import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { Navigate, useNavigate } from 'react-router'
import { authContext } from '../context/useContext.jsx'
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaArrowRightFromBracket } from "react-icons/fa6";


const Navbar = ({ menu, setMenu, doSignInGoogle }) => {
  const navigate = useNavigate()
  const { user, signOut } = useContext(authContext)
  const [cartData,setCartData]=useState([])
  const [loading,setLoading]=useState(false)
  const url=import.meta.env.VITE_BASE_URL


  useEffect(() => {


    if (!user?.uid) {
        console.log("User not ready yet");
        return;
    }
    const fetchData = async () => {
        try {
            const res = await axios.post(`${url}/getUser`, { user_id: user.uid });
            
            
            setCartData(res.data.findUser.user_cart || []);
        } catch (err) {
            console.log(err.message)
        }
    };

    if (user) setTimeout(()=>{fetchData()},500);
}, [cartData,user]);

  const handleSignIn = async (e) => {
    setLoading(true);
  
    try {
      await doSignInGoogle(); 

    } catch (err) {
      console.error("Sign-in failed:", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);
  
  

  const handleSignOut = () => {
    signOut();
    setLoading(false)
  };


  return (
    <>
      <nav className='navbar'>
        <img src={assets.logo} className='logo' onClick={() => navigate('/')} alt="logo" />
        <div className='nav-links'>
  <a
    onClick={() => {
      navigate("/", { state: { section: "home" } });
    }}
    className={menu === "home" ? "active" : ""}
  >
    Home
  </a>
  <a
    onClick={() => {
      navigate("/", { state: { section: "menu" } });
    }}
    className={menu === "menu" ? "active" : ""}
  >
    Menu
  </a>
  <a
    onClick={() => {
      navigate("/", { state: { section: "about" } });
    }}
    className={menu === "about" ? "active" : ""}
  >
    About
  </a>
  <a
    onClick={() => {
      navigate("/", { state: { section: "contact" } });
    }}
    className={menu === "contact" ? "active" : ""}
  >
    Contact Us
  </a>
  
</div>


        <div className='funcs'>
          
          <a  onClick={()=>navigate("/", { state: { section: "menu" } })}><img className='icons search-ic' src={assets.search_icon} alt='search' /></a>
          <div className="bag">
            <img
            src={assets.basket_icon}
            onClick={() => navigate('/cart')}
            className="icons"
            alt="cart"
            />

            {cartData.length>0?<span className="dot"></span>:null}
            
          </div>
          <a  onClick={()=>navigate("/myorders")}><img className='parcel' src={assets.parcel_icon} alt='orders'/></a>
          {user ? (
            <div className='user-profile'>
              <img src={user.photoURL} className='pro-img' alt='profile' />
              <FaArrowRightFromBracket className='logout-icon' onClick={handleSignOut} title="Sign Out" />
            </div>
          ) : (
          loading ? (
            <button disabled className='sign-in'>Signing In...</button>
          ) : (
            <button onClick={handleSignIn} className='sign-in'>Sign in</button>
           )
          )}

        </div>
      </nav>

      <div className='small-nav'>
  <a onClick={() => navigate("/", { state: { section: "home" } })} className={menu === "home" ? "active" : ""}>Home</a>
  <a onClick={() => navigate("/", { state: { section: "menu" } })} className={menu === "menu" ? "active" : ""}>Menu</a>
  <a onClick={() => navigate("/", { state: { section: "about" } })} className={menu === "about" ? "active" : ""}>About</a>
  <a onClick={() => navigate("/", { state: { section: "contact" } })} className={menu === "contact" ? "active" : ""}>Contact Us</a>
</div>

    </>
  )
}

export default Navbar
