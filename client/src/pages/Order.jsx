import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { authContext } from '../context/useContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const Order = () => {
  const User = useAuthRedirect();
  const cart_info = JSON.parse(localStorage.getItem("cartSummary")) || {};
  const { user } = useContext(authContext);
  const url = import.meta.env.VITE_BASE_URL;

  const onAddDeliveryAddress = async (e) => {
    e.preventDefault();

    const finalOrderData = {
      first_name: document.getElementById("firstName").value.trim(),
      last_name: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      street: document.getElementById("street").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      pincode: document.getElementById("pincode").value.trim(),
      country: document.getElementById("country").value.trim(),
      number: document.getElementById("number").value.trim(),
      user_id: user.uid
    };

    // Frontend phone validation
    if (!/^[6-9]\d{9}$/.test(finalOrderData.number)) {
      return toast.error("Please enter a valid 10-digit Indian phone number");
    }

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);

      // Fetch user's cart from backend
      const userData = await axios.post(`${url}/getUser`, { user_id: user.uid });

      const result = await axios.post(`${url}/placeOrder`, {
        delivery_address: finalOrderData,
        cart_data: userData.data.findUser.user_cart,
        couponApplied: cart_info.couponApplied
      });

      const sessionId = result.data.id;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error("Payment canceled by user");
      } else {
        toast.success("Payment Successful!");
      }

    } catch (err) {
      console.error(err);
      // Show backend or Stripe error in toast
      if (err.response?.data) {
        toast.error(err.response.data);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return User ? (
    <div>
      <Navbar />
      <form onSubmit={onAddDeliveryAddress} className='delivery-page-container'>
        <div className='delivery-container'>
          <div className='delivery-info'>
            <div className='user-name'>
              <input id='firstName' type='text' placeholder='First name' required />
              <input id='lastName' type='text' placeholder='Last name' required />
            </div>
            <input id='email' type='email' placeholder='Email address' required />
            <input id='street' type='text' placeholder='Street' required />
            <div className='user-name'>
              <input id='city' type='text' placeholder='City' required />
              <input id='state' type='text' placeholder='State' required />
            </div>
            <div className='user-name'>
              <input id='pincode' type='number' placeholder='Zipcode' required />
              <input id='country' type='text' placeholder='Country' required />
            </div>
            <input
              id='number'
              type='tel'
              placeholder='Phone'
              pattern='[6-9][0-9]{9}'
              title='Enter a valid 10-digit Indian phone number'
              required
            />
          </div>

          <div className="delivery-cart-info">
            <h1>Cart Totals</h1>
            <div className="info">
              <p>Subtotal</p>
              <p>{cart_info.subTotal}/-</p>
            </div>
            <hr />
            <div className="info">
              <p>Delivery Fee</p>
              <p>{cart_info.deliveryFee}/-</p>
            </div>
            <hr />
            <div className="info">
              <p>Total</p>
              <p>{cart_info.total}</p>
            </div>
            <div className="cart-button">
              <button>Proceed to Payment</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default Order;
