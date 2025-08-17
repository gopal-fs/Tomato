import React, { useContext, useEffect, useState } from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { authContext } from "../context/useContext";

const Cart = () => {
  const User = useAuthRedirect();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const { user } = useContext(authContext);
  const url = import.meta.env.VITE_BASE_URL;
  const { search } = useLocation();
  const navigate = useNavigate();
  const coupon = import.meta.env.VITE_COUPON;

  // Show toast if payment canceled
  useEffect(() => {
    const fetch=async()=>{
      const params = new URLSearchParams(search);

    if (params.get("canceled") === "true") {
      toast.error("Payment Canceled by user!");
      const order_id= params.get("order_id")
      if(order_id){
        try{
          const deleteOrder= await axios.post(`${url}/deleteOrder`,{order_id:order_id})
          navigate('/cart')
          
        }
        catch(err){
          console.log(err.message)
        }
        
      }
    }

    }
    fetch()
    
  }, [search]);

  // Fetch user's cart from backend
  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      try {
        const res = await axios.post(`${url}/getUser`, { user_id: user.uid });
        setCartData(res.data.findUser.user_cart || []);
      } catch (err) {
        toast.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate subtotal, delivery fee, and save cart summary
  useEffect(() => {
    const total = cartData.reduce((acc, cart) => acc + (cart.total || cart.price * cart.quantity), 0);

    let fee = 0;
    if (total < 300) fee = 20;
    else if (total >= 300 && total <= 1000) fee = 30;
    else fee = 50;

    const savedSummary = JSON.parse(localStorage.getItem("cartSummary") || "{}");
    let couponApplied = savedSummary.couponApplied || false;

    if (total === 0) couponApplied = false;

    const subTotalToSet = couponApplied ? Math.max(0, total - 20) : total;

    setDeliveryFee(fee);
    setSubTotal(subTotalToSet);

    localStorage.setItem(
      "cartSummary",
      JSON.stringify({
        subTotal: subTotalToSet,
        deliveryFee: fee,
        total: subTotalToSet + fee,
        couponApplied,
      })
    );
  }, [cartData]);

  // Apply coupon
  const onSubmitCoupon = () => {
    const code = document.getElementById("promo").value.trim();

    if (code === coupon) {
      const summary = JSON.parse(localStorage.getItem("cartSummary") || "{}");

      if (summary.subTotal && summary.subTotal > 30 && !summary.couponApplied) {
        summary.subTotal = Math.max(0, summary.subTotal - 20);
        summary.total = summary.subTotal + summary.deliveryFee;
        summary.couponApplied = true;

        setSubTotal(summary.subTotal);
        localStorage.setItem("cartSummary", JSON.stringify(summary));
        return toast.success("Coupon Applied!");
      }
      return toast.error("Coupon Already Applied");
    }

    return toast.error("Invalid Coupon");
  };

  // Navigate to order page
  const onAppendOrder = () => navigate("/order");

  // Remove item from cart
  const onRemoveCartItem = async (item) => {
    try {
      const res = await axios.post(`${url}/onUpdateCart`, { user_id: user.uid, product_id: item.product_id });
      toast.success(res.data.message);
      setCartData(res.data.user_cart);
    } catch (err) {
      toast.error(err.response?.data || err.message);
    }
  };

  if (!User) return null;

  if (loading) {
    return (
      <div className="cart-page-container">
        <Navbar />
        <div className="onload">
            <p>Loading your cart...</p>
        </div>
       
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <Navbar />
      {cartData.length < 1 ? (
        <div className="no-cartitems">
          <h1>Your Cart Is Empty</h1>
          <img
            src="https://cdn-icons-png.flaticon.com/512/11010/11010851.png"
            className="cart-img"
            alt="cart"
          />
          <button onClick={() => navigate("/", { state: { section: "menu" } })}>Order Now</button>
        </div>
      ) : (
        <div className="cart">
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Item</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            {cartData.map((item) => (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.title} />
                  <p>{item.title}</p>
                  <p>{item.price}/-</p>
                  <p>{item.quantity}</p>
                  <p>{item.price * item.quantity}</p>
                  <X onClick={() => onRemoveCartItem(item)} size={20} className="x-mark" />
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      )}

      {cartData.length > 0 && (
        <div className="cart-total">
          <div className="total-card">
            <div className="promo-card">
              <p>If you have a promo code, enter it here:</p>
              <input id="promo" placeholder="promo code" type="text" />
              <button onClick={onSubmitCoupon}>Submit</button>
            </div>

            <div className="cart-info">
              <h1>Cart Totals</h1>
              <div className="info">
                <p>Subtotal</p>
                <p>{subTotal}</p>
              </div>
              <hr />
              <div className="info">
                <p>Delivery Fee</p>
                <p>{deliveryFee}</p>
              </div>
              <hr />
              <div className="info">
                <p>Total</p>
                <p>{subTotal + deliveryFee}</p>
              </div>
              <div className="cart-button">
                <button onClick={onAppendOrder}>Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
