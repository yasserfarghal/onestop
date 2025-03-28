import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import logo from "../../assets/Group 181.png";
import userImg from "../../assets/149071.png";
import Menu4Line from "remixicon-react/Menu4LineIcon";
import { motion } from "framer-motion";
import useAuth from "../../custom_hooks/useAuth";
import {auth} from "../../firebaseConfigure"
import { toast } from "react-toastify";
import {  signOut } from "firebase/auth";
import Search2Line from 'remixicon-react/Search2LineIcon'


const AdminHeader = () => {



  const currentUser = useAuth().currentUser
  
  const nav_Link = [
    {
      path: "..",
      display: "User-Site",
    },
    {
      path: ".",
      display: "Dashboard",
    },
    {
      path: "Add-Products",
      display: "Add Product",
    },
    {
      path: "All-Products",
      display: "Products",
    },
    {
      path: "All-Users",
      display: "Users",
    },
    {
      path: "orders",
      display: "Orders",
    },
  ];

  const headerRef = React.useRef();

  const menuRef = React.useRef();

  const profileRef = React.useRef();




  const stickyHeaderFunction = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollHeight > 80 ||
        document.documentElement.scrollHeight < 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  }; 

  const toggle = () => {
    menuRef.current.classList.toggle('active_menu')
  }

  const togleProfile = () =>{
    profileRef.current.classList.toggle('active_profile')
  }

  React.useEffect(() => {
    stickyHeaderFunction();

    return () => {
      window.removeEventListener("scroll", stickyHeaderFunction);
    };
  });

  const logOut = () => {
    signOut(auth).then(() => {
      toast.success("logout")
    }).catch((error) => {
      // An error happened.
    });
  } 

  return (
    <>
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav_wrapper">
          <div className="logo">
            <NavLink to=".">
              <img src={logo} alt="logo" className="img" />
            </NavLink>
          </div>

          <div className="search_box d-flex align-items-center">
                <input  type="text" placeholder='Search For..?' />
                <span><Search2Line className='searchIcon pt-1'/></span>
              </div>



          <div className="nav_icons d-flex align-items-center justify-content-center">
            

            <span>
              <div className="profile">
              <motion.img
                whileHover={{ scale: 1.1 }}
                alt="user_picture"
                src={currentUser?.photoURL || userImg}  // Fallback image
                className="profile_img"
                onClick={togleProfile}
              />

              <div ref={profileRef} onClick={togleProfile} className="profile_actions ">
                {currentUser ? <p onClick={logOut}>LOGOUT</p> : <div className="d-flex justify-content-center flex-column">
                <Link to="/login">LOGIN</Link>
                <Link to="/signup">REGISTER</Link>
                  </div>}
              </div>
              </div>
            </span>

            <div className="mobile_menu">
            <span onClick={toggle}>
              <Menu4Line className="icon" />
            </span>
          </div>
          </div>


        </div>
      </Container>
    </header>

    <section className="pt-0 pb-1 naving_links">
      <Container>
        <Row>
          <Col md={12} lg={12} sm={12}>
          <div className="navigation" ref={menuRef} onClick={toggle} >
            <ul className="d-flex align-items-center justify-content-center menu">
              {nav_Link.map((item, index) => (
                <li key={index} className="mt-3 mb-3 nav_item">
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav_link" : ""
                    }
                    end={item.path === "."}
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default AdminHeader;
