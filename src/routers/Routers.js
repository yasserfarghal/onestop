import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart.jsx';
import ProductDetials from '../pages/Productdetails.jsx';
import Checkout from '../pages/Checkout.jsx';
import OrdersUser from '../pages/OrdersUser.jsx';
import OrdersUserDetails from '../pages/OrderDetails.jsx';


import Login from '../pages/Login';
import SignUp from '../pages/Signup';
import Error404 from '../pages/Error404';
import Protected from './protected/Protected';

import HostLayout from '../admin/components/layout/HostLayout';
import Dashboard from '../admin/pages/Dashboard';
import AddProducts from '../admin/pages/AddProducts';
import AllProducts from "../admin/pages/AllProducts.jsx";
import ProductFullDetails from "../admin/pages/ProductFullDetails.jsx";
import Users from '../admin/pages/Users.jsx'
import Orders from '../admin/pages/Orders';
import OrdersDetails from '../admin/pages/OrderDetails';
import Profile from '../pages/Profile';

const Routers = () => {
  return (
    <Routes>
      <Route path="*" element={<Error404 />} />
      <Route index element={<Home />} /> 
      <Route path="shop" element={<Shop />} />
      <Route path="shop/:id" element={<ProductDetials />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Protected />}>
        <Route index element={<Checkout />} />
      </Route>
      <Route path="orders" element={<Protected />}>
      <Route index element={<OrdersUser />} />
      
      </Route>

      <Route path="Orders/:id" element={<OrdersUserDetails />} />

      <Route path="profile" element={<Protected />}>
        <Route index element={<Profile />} />
      </Route>
      <Route element={<Protected />}>
        <Route path='dashboard' element={<HostLayout />}>
          <Route path="*" element={<Error404 />} />
          <Route index element={<Dashboard />} />
          <Route path="Add-Products" element={<AddProducts />} />
          <Route path="All-Products" element={<AllProducts />} />
          <Route path="All-Products/:id" element={<ProductFullDetails />} />
          <Route path="All-Users" element={<Users />} />
          <Route path="Orders" element={<Orders />} />
          <Route path="Orders/:id" element={<OrdersDetails />} />



        </Route>
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  );
};

export default Routers;
