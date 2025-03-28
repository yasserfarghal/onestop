import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import logo from "../../assets/Group 181.png";
import userImg from "../../assets/149071.png";
import RiShoppingCartLineIcon from "remixicon-react/ShoppingCartLineIcon";
import Heart2Line from "remixicon-react/Heart2LineIcon";
import Menu4Line from "remixicon-react/Menu4LineIcon";
import { motion } from "framer-motion";
import {useSelector, useDispatch} from 'react-redux'
import useAuth from "../../custom_hooks/useAuth";
import {auth} from "../../firebaseConfigure"
import { toast } from "react-toastify";
import {  signOut } from "firebase/auth";
import { cartAction } from "../../redux/slices/cartSlice";
import { favActions } from "../../redux/slices/favSlice";
import { authActions } from "../../redux/slices/authSlice";


const Header = () => {

  const dispatch = useDispatch()

  const currentUser = useAuth().currentUser

    
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  const favourites = useSelector(state => state.fav.totalFavs);

  const user = useSelector(state => state.auth.currentUser);
  
  const nav_Link = [
    {
      path: ".",
      display: "Home",
    },
    {
      path: "shop",
      display: "Shop",
    },
    {
      path: "cart",
      display: "Cart",
    },
    ...(currentUser && currentUser.email !== "admin@gmail.com" && user!==null 
      ? [

          {
            path: "orders",
            display: "Orders",
          },
        ]
      : currentUser && currentUser.email === "admin@gmail.com" ? (
        [
          {
            path: "dashboard",
            display: "Dashboard",
          },
        ]
      ):[]),
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
      dispatch(cartAction.resetCart())
      dispatch(favActions.resetFavs())
      dispatch(authActions.logout())

    }).catch((error) => {
      // An error happened.
    });
  } 




  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav_wrapper">
          <div className="logo">
            <NavLink to=".">
              <img src={logo} alt="logo" className="img" />
            </NavLink>
          </div>

          <div className="navigation" ref={menuRef} onClick={toggle} >
            <ul className="menu">
              {nav_Link.map((item, index) => (
                <li key={index} className="nav_item">
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav_link" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav_icons d-flex align-items-center justify-content-center">
            {currentUser && currentUser.email !== "admin@gmail.com" || !currentUser?  <>
            <span className="fav_icon">
              <Heart2Line className="favIcon" />
              <span className="badge">{favourites}</span>
            </span>
            <span className="cart_icon">
              <Link to="/cart">
              <RiShoppingCartLineIcon className="cartIcon" />
              <span className="badge">{totalQuantity}</span>
              </Link>

            </span>
            </> : null}
            <span>
              <div className="profile">
              <motion.img
  whileHover={{ scale: 1.1 }}
  alt="user_picture"
  src={user?.photoURL || currentUser?.photoURL || userImg}
  className="profile_img"
  onClick={togleProfile}
/>


              <div ref={profileRef} onClick={togleProfile} className="profile_actions ">
                {currentUser ? <div>
                  <Link to="profile">Profile</Link>
                  <p onClick={logOut}>LOGOUT</p>
                </div> : <div className="d-flex justify-content-center flex-column">
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
  );
};

export default Header;
