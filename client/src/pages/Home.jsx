import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { useLocation } from 'react-router'
import { menu_list } from '../assets/frontend_assets/assets.js'
import toast from 'react-hot-toast'
import Contact from '../components/Contact.jsx'
import Navbar from '../components/Navbar.jsx'
import { auth, googleProvider } from '../configs/firebase.js'
import { signInWithPopup } from 'firebase/auth'
import { authContext } from '../context/useContext.jsx'
import axios from 'axios'

const Home = () => {
  const url = import.meta.env.VITE_BASE_URL
  const homeRef = useRef(null)
  const menuRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  const sectionRefs = {
    home: homeRef,
    menu: menuRef,
    about: aboutRef,
    contact: contactRef,
  }

  const [menu, setMenu] = useState('home')
  const [category, setCategory] = useState()
  const { user } = useContext(authContext)
  const [products, setProducts] = useState([])
  const [cartData, setCartData] = useState([])

  // Scroll on menu change
  useEffect(() => {
    const ref = sectionRefs[menu]
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [menu])

  const location = useLocation()
  useEffect(() => {
    if (location.state?.section) {
      setMenu(location.state.section)
    }
  }, [location.state])

  // Fetch foods
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/food/getFoods`)
        setProducts(res.data)
      } catch (err) {
        console.error('Error fetching foods:', err)
      }
    }
    fetchData()
  }, [])

  // Fetch cart data
  useEffect(() => {
    if (!user) return
    fetchCart()
  }, [user])

  // 👇 inside fetchCart()
const fetchCart = async (suppressError = false) => {
  if (!user) return;
  try {
    const res = await axios.post(`${url}/getUser`, { user_id: user.uid });
    setCartData(res.data.findUser?.user_cart || []);
  } catch (err) {
    const msg = err.response?.data || err.message;

    // ✅ Suppress "User not found" error gracefully
    if (msg === "User not found") {
      console.log("No user found yet, skipping cart fetch...");
      return; // don't show toast
    }

    if (!suppressError) toast.error(msg);
  }
};


  // Get quantity of a product from cart
  const getQuantity = (product_id) => {
    const item = cartData.find((c) => c.product_id === product_id)
    return item ? item.quantity : 0
  }

  // Add new product to cart
  const addToCart = async (item) => {
    if (!user) return toast.error('Please Sign-In First')
    try {
      await axios.post(`${url}/onAddCart`, {
        user_id: user.uid,
        cart_product: {
          product_id: item.product_id,
          title: item.name,
          image: item.image,
          price: item.price,
          quantity: 1,
          total: item.price,
        },
      })
      await fetchCart()
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Update quantity in backend
  const updateQuantity = async (item, type) => {
    try {
      const res = await axios.post(`${url}/updateQuantity`, {
        user_id: user.uid,
        product_id: item.product_id,
        action: type, // "inc" or "dec"
      })
      setCartData(res.data.user_cart)
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Google Sign-in
  // Google Sign-in
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
      user_cart: [],
    };

    // ✅ Ensure backend has the user before fetching cart
    const res = await axios.post(`${url}/addUser`, new_user);

    if (res.data === "User Added") {
      toast.success("Welcome! Your account has been created.");
    } else if (res.data === "User already exists") {
      toast.success("Welcome back!");
    }

    // ✅ Only fetch cart AFTER user creation success
    setTimeout(() => fetchCart(true), 300); // small delay to let backend update
  } catch (e) {
    toast.error(e.message);
  }
};


  return (
    <div className='bg-container'>
      <Navbar menu={menu} setMenu={setMenu} doSignInGoogle={doSignInGoogle} />

      {/* Hero Section */}
      <section id='section-home' className='hero-section' ref={homeRef}>
        <div className='container'>
          <img src={assets.header_img} alt='Food Item' />
          <div className='overlay'>
            <h1>
              Order Your <br /> favourite food here
            </h1>
            <p>
              Choose from a diverse menu feauturing a delectable array of dishes
              crafted with the finest ingredients and culinary expertise Our
              mission is to satisfy your cravings and elevate your dining
              experience,one delicious meal at a time
            </p>
            <a href='#section-menu'>View Menu</a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id='section-menu' className='menu-section' ref={menuRef}>
        <div className='menu-card'>
          <h1>Explore our menu</h1>
          <p className='menu-text'>
            Choose from a diverse menu featuring a delectable array of dishes.
          </p>
          <div className='menu-list-container'>
            {menu_list.map((data, index) => (
              <div key={data.menu_name || index} className='menu-container'>
                <div
                  className={`${
                    category === data.menu_name ? 'menu-active' : ''
                  } menu-images-container`}
                >
                  <img
                    onClick={() => setCategory(data.menu_name)}
                    src={data.menu_image}
                    alt='menu'
                  />
                </div>
                <p>{data.menu_name}</p>
              </div>
            ))}
          </div>
          <hr className='menu-line' />
          <h2 className='dish-head'>Top dishes near you</h2>
          <div className='dishes-container'>
            {products
              .filter((food) => !category || food.category === category)
              .map((data) => (
                <div key={data._id} className='dish-card'>
                  <img src={data.image} className='menu-image' alt='dish' />
                  <div className='dish-bottom-container'>
                    <div className='dish-top'>
                      <h3 className='dish-name'>{data.name}</h3>
                      <img
                        className='dish-img'
                        src={assets.rating_starts}
                        alt='rating'
                      />
                    </div>
                    <p className='dish-desc'>{data.description}</p>
                    <div className='dish-bottom'>
                      <h3 className='dish-price'>{data.price}/-</h3>

                      {getQuantity(data.product_id) > 0 ? (
                        <div className='quantity-controls'>
                          <button
                            disabled={getQuantity(data.product_id) === 1}
                            onClick={() => updateQuantity(data, 'dec')}
                          >
                            <img src={assets.remove_icon_red} alt='remove' />
                          </button>
                          <span>{getQuantity(data.product_id)}</span>
                          <button
                            onClick={() => updateQuantity(data, 'inc')}
                          >
                            <img src={assets.add_icon_green} alt='add' />
                          </button>
                        </div>
                      ) : (
                        <button
                          className='dish-btn'
                          onClick={() => addToCart(data)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='section-about' className='section-about' ref={aboutRef}>
        <h1>About Us</h1>
        <div className='about-container'>
          <img
            src='https://thumbs.dreamstime.com/b/close-up-food-photography-mix-non-veg-image-has-been-generated-generative-ai-indulge-showcasing-311085580.jpg'
            className='about-img'
            alt='about'
          />
          <div className='content'>
            <h1 className='spec'>
              We Are Specialized In <br /> Spicy Modern Fusion Food{' '}
            </h1>
            <div className='head'>
              <p>Welcome To Tomato</p>
              <hr className='about-line' />
            </div>
            <p className='about-desc'>
              At Tomato, we believe that great food brings people together.
              Whether you're searching for new recipes, exploring your favorite
              cuisines, or looking to discover hidden gems in your city, we've
              got you covered. From street food to gourmet, from quick bites to
              slow-cooked feasts — our platform celebrates it all. Our mission
              is simple: to make good food accessible, enjoyable, and inspiring
              for everyone. With carefully curated content, honest reviews, and
              a vibrant community of food lovers, Tomato is your trusted
              companion in every culinary journey. So go ahead, explore, taste,
              and fall in love with food all over again — only on Tomato.
            </p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <div className='download-section'>
        <h1>
          For Better Experience Download
          <br />
          Tomato App
        </h1>
        <div className='download-images'>
          <a
            href='https://play.google.com/store'
            target='_blank'
            rel='noreferrer'
          >
            <img src={assets.play_store} alt='google-play' />
          </a>
          <a
            href='https://www.apple.com/in/app-store/'
            target='_blank'
            rel='noreferrer'
          >
            <img src={assets.app_store} alt='app-store' />
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <section id='section-contact' ref={contactRef}>
        <Contact />
      </section>
    </div>
  )
}

export default Home
