import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast'; 
import { useContext } from 'react';
import { authContext } from './context/useContext';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Myorders from './pages/Myorders';
import AdminLayout from './layouts/AdminLayout';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';
import AdminOrders from './pages/AdminOrders';
import ErrorPage from './components/ErrorPage';

function App() {
  const {user}=useContext(authContext)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<Order />}/>
        <Route path='/myorders' element={<Myorders />}/>
        <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<AddProduct />} />
          <Route index path='add-product' element={<AddProduct />} />
          <Route path='products-list' element={<ProductsList />}/>
          <Route path='orders' element={<AdminOrders />} />
        </Route>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>

      
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </BrowserRouter>
  );
}

export default App;
