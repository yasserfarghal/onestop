import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../../custom_hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { TailSpin } from  'react-loader-spinner'


const Protected = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading state or any fallback UI while fetching user data
    return <div className='loading_spinner d-flex align-items-center justify-content-center'>
      <TailSpin
    height="80"
    width="80"
    color="rgb(138, 61, 93)"
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
    </div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected;
