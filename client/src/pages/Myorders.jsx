import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/useContext';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import { assets } from '../assets/frontend_assets/assets';
import { Dot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import axios from 'axios';
import ErrorPage from '../components/ErrorPage';


const Myorders = () => {
  const { user } = useContext(authContext);
  const { search } = useLocation();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;

  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  
useEffect(() => {
  if (user !== undefined) setAuthLoading(false);
}, [user]);


useEffect(() => {
  if (!authLoading && user === null) {
    toast.error('Please sign-in first');
    navigate('/');
  }
}, [authLoading, user]);


  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.uid) return;
      setLoading(true);

      const params = new URLSearchParams(search);
      const orderId = params.get("order_id");
      const success = params.get("success");

      try {
        if (orderId && success) {
          await axios.post(`${url}/deleteCart`, { user_id: user.uid });
          const res = await axios.get(`${url}/myorders?order_id=${orderId}&user_id=${user.uid}`);
          if (res.data.order) {
            if (res.data.showToast) toast.success("Payment Successful!");
            setOrders([res.data.order]);
          } else {
            setNotFound(true);
          }
        } else {
          const res = await axios.get(`${url}/myorders?user_id=${user.uid}`);
          if (res.data.orders && res.data.orders.length > 0) {
            const sortedOrders = res.data.orders.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
            setOrders(sortedOrders);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch orders");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, search]);

  const onChangeOrderStatus = (orderId) => {
    setOrderStatus(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (authLoading || loading) return (
    <div className='onload'>
      <Navbar />
      <p>Loading Orders Please Wait...</p>
    </div>
  )

  

  return (
    <div className='my-orders-container'>
      <Navbar />
      <h1 className='my-order'>My Orders</h1>
      <div className='myorder-contact'>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.order_id} className='order'>
              <div className='main-order'>
                <img src={assets.parcel_icon} alt='parcel' className='parcel-icon' />
                <div className='order-items'>
                  {order.user_cart.map((item, idx) => (
                    <p key={idx}>{item.title} x {item.quantity}</p>
                  ))}
                </div>
                <p>Amount Paid: {order.amount_paid}/-</p>
                <p>Items: {order.user_cart.length}</p>

                {orderStatus[order.order_id] ? (
                  <div className='status'>
                    <Dot className='order-status' size={30} />
                    <p>{order.status}</p>
                  </div>
                ) : (
                  <p>Status</p>
                )}

                <button onClick={() => onChangeOrderStatus(order.order_id)}>
                  {orderStatus[order.order_id] ? "Hide Status" : "Track Order"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='noorder'>No orders found</p>
        )}
        <Contact />
      </div>
    </div>
  );
};

export default Myorders