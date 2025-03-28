import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from "../AdminHeader";
import Footer from '../../../components/footer/Footer';
import Protected from '../../../routers/protected/Protected';
import useAuth from '../../../custom_hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { TailSpin } from  'react-loader-spinner'


const HostLayout = () => {
  const { currentUser, loading } = useAuth();

  const location = useLocation().pathname

  if (loading) {
    // Show a loading state or any fallback UI while fetching user data
    return <div><TailSpin
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  /></div>;
  }

  if (!currentUser) {
    // If user is not logged in, redirect to the home page or login page
    return <Navigate to="/login" />;
  }

  // Check if the user's email is "admin@gmail.com"
  const isAdmin = currentUser.email === "admin@gmail.com";

  if (isAdmin) {
    // If user is an admin, show the dashboard layout
    return (
      <div className='host'>
        <AdminHeader /> 
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  } else {
    // If user is not an admin, redirect to the home page or other routes
    return <Navigate to=".." />;
  }
};

export default HostLayout;
