import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Dropdown } from "react-bootstrap";
import logo from "../../assets/Group 153.png";
import userImg from "../../assets/149071.png";
import RiShoppingCartLineIcon from "remixicon-react/ShoppingCartLineIcon";
import Heart2Line from "remixicon-react/Heart2LineIcon";
import Menu4Line from "remixicon-react/Menu4LineIcon";
import { Globe } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../firebaseConfigure";
import { toast } from "react-toastify";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { cartAction } from "../../redux/slices/cartSlice";
import { favActions } from "../../redux/slices/favSlice";
import { authActions } from "../../redux/slices/authSlice";

const Header = () => {
  const [language, setLanguage] = useState("en");
  const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const favourites = useSelector((state) => state.fav.totalFavs);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const nav_Link = [
    { path: ".", display: "Home" },
    { path: "shop", display: "Shop" },
    { path: "cart", display: "Cart" },
    ...(currentUser && currentUser.email !== "admin@gmail.com"
      ? [{ path: "orders", display: "Orders" }]
      : currentUser && currentUser.email === "admin@gmail.com"
      ? [{ path: "dashboard", display: "Dashboard" }]
      : []),
  ];

  const headerRef = useRef();
  const menuRef = useRef();
  const profileRef = useRef();

  const stickyHeaderFunction = () => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  };

  const toggleProfile = () => {
    profileRef.current.classList.toggle("active_profile");
  };

  useEffect(() => {
    stickyHeaderFunction();
    return () => {
      window.removeEventListener("scroll", stickyHeaderFunction);
    };
  }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully");
        dispatch(cartAction.resetCart());
        dispatch(favActions.resetFavs());
        dispatch(authActions.logout());
      })
      .catch((error) => {
        toast.error("Logout failed: " + error.message);
      });
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav_wrapper">
          <div className="logo">
            <NavLink to=".">
              <img src={logo} alt="logo" className="img" />
            </NavLink>
          </div>

          <div className="navigation" ref={menuRef}>
            <ul className="menu">
              {nav_Link.map((item, index) => (
                <li key={index} className="nav_item">
                  <NavLink to={item.path}>{item.display}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav_icons d-flex align-items-center justify-content-center">
            {currentUser && currentUser.email !== "admin@gmail.com" ? (
              <span className="cart_icon">
                <Link to="/cart">
                  <RiShoppingCartLineIcon className="cartIcon" />
                  <span className="badge">{totalQuantity}</span>
                </Link>
              </span>
            ) : null}

            <span>
            <div className="profile">
              <motion.img
  whileHover={{ scale: 1.1 }}
  alt="user_picture"
  src={currentUser?.photoURL || userImg}
  className="profile_img"
  onClick={toggleProfile}
/>



              <div ref={profileRef} onClick={toggleProfile} className="profile_actions ">
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

            <Dropdown>
              <Dropdown.Toggle variant="light" id="language-dropdown">
                <Globe size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLanguage("en")}>
                  🇺🇸 English
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("fr")}>
                  🇫🇷 French
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("es")}>
                  🇪🇸 Spanish
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("ar")}>
                  🇸🇦 Arabic
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div className="mobile_menu">
              <span onClick={() => menuRef.current.classList.toggle("active_menu")}>
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
