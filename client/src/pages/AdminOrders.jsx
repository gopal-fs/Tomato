import React, { useEffect, useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import axios from 'axios';
import Contact from '../components/Contact';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL=import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/myorders`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch admin orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const onChangeProductStatus = async (id, event) => {
    const status = event.target.value;

    // Optimistic UI update
    const prevOrders = [...orders];
    setOrders(prev =>
      prev.map(order =>
        order._id === id ? { ...order, status } : order
      )
    );
    try {
      const res = await axios.post(`${URL}/api/food/updateStatus`, { status, order_id: id });

      if (res.data.success) {
        toast.success(res.data.message);
        // Ensure local state matches backend
        setOrders(prev =>
          prev.map(order =>
            order._id === id ? { ...order, status: res.data.order.status } : order
          )
        );
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      console.error(err);
      // Rollback to previous state
      setOrders(prevOrders);
    }
  };

  return (
    <>
      <h1 className='my-order'>All Orders</h1>
      <div className='myorder-contact'>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className='order'>
              <div className='main-order admin-order'>
                <img src={assets.parcel_icon} alt='parcel' className='parcel-icon' />
                <div className='order-items'>
                  {order.user_cart.map((item, idx) => (
                    <p key={idx}>{item.title} x {item.quantity}</p>
                  ))}
                </div>
                <p>Amount Paid: {order.amount_paid}/-</p>
                <p>Items: {order.user_cart.length}</p>

                <select
                  onChange={(event) => onChangeProductStatus(order._id, event)}
                  value={order.status || "Food Processing"} // fallback value
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p className='noorder'>No orders found</p>
        )}
        <Contact />
      </div>
    </>
  );
};

export default AdminOrders;
