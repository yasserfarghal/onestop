import React from 'react'
import AdminHeader from '../../admin/components/AdminHeader'
import Header from '../Header/Header'
import Footer from '../footer/Footer'
import Routers from '../../routers/Routers'
import { useLocation } from 'react-router-dom'
import useAuth from '../../custom_hooks/useAuth'

const Layout = () => {

  const currentUser = useAuth()

  

  const location = useLocation()

  return (
    <div>
      {location.pathname.startsWith("/dashboard")? null : <Header />}
      
      <main>
        <Routers />
      </main>
      {location.pathname.startsWith("/dashboard")? null : <Footer />}
    </div>
  )
}

export default Layout
