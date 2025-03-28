import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Helmet from "../components/helmet/Helmet";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth,googleProvider } from "../firebaseConfigure";
import {  signInWithPopup,signInWithEmailAndPassword } from "firebase/auth";
import GoogleFill from 'remixicon-react/GoogleFillIcon'
import { collection,addDoc } from "firebase/firestore";
import { db } from "../firebaseConfigure";
import useAuth from "../custom_hooks/useAuth";
import useGetData from "../custom_hooks/useGetData";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/slices/authSlice";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocation = location.state?.from;
  const dispatch= useDispatch()

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        return blob;
      } else {
        throw new Error('Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  };
  


  const {currentUser,loading} = useAuth()
  const {data:usersFirebase, loading:usersFirebaseLoading} = useGetData("users")


  const [user, setUser] = React.useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const data = e.target;
    const name = data.name;
    const value = data.value;
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const handleSubmitter = (e) => {
    e.preventDefault();

    if (user.email === "" || user.password === null) {
      toast.error("Please check on your entered data");
    } else {
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          toast.success("Login Success");
          
          dispatch(authActions.login({
            displayName:user.displayName,
            email:user.email,
            photoURL:user.photoURL
          }))

          if (user.email === "admin@gmail.com") {
            navigate("/dashboard");
          } else {
            if (prevLocation) {
              navigate(prevLocation.pathname);
            } else {
              navigate("/");
            }
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error("Please Check On Your Data");
        });
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user; // Get the signed-in user info
        toast.success("Login Success");
  
        dispatch(authActions.login({
          displayName:user.displayName,
          email:user.email,
          photoURL:user.photoURL
        }))
  
        if (prevLocation) {
          navigate(prevLocation.pathname);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };
  
  
  
    React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [loading]);
  
  

  
  
  return (
    <Helmet title="Login">
      {currentUser&& !loading ? navigate("/"): (
              <section className="login">
              <Container>
                <Row>
                  <Col>
                    <div className="login_form">
                      <div className="text-center">
                      <h5 className="section_title">WELCOME BACK</h5>
                      <p>You have been messed.</p>
                      </div>
      
                      <form className="container mt-4 mb-3">
                        <Row className="mb-3">
                          <Form.Group
                            controlId="formBasicEmail"
                            className="col"
                          >
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="example@mail.com"
                            />
                          </Form.Group>
                        </Row>
                        <Row>
                        <Form.Group
                            controlId="formBasicEmail"
                            className="col"
                          >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={user.password}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Your Email Password"
                            />
                          </Form.Group>
                        </Row>
                        <motion.button className="mb-0" onClick={handleSubmitter} whileTap={{scale:1.1}}>LOGIN</motion.button>
                        <span class="d-block text-center my-4 text-muted">&mdash; or &mdash;</span>
      
                        <Row>
                          <Col className="text-center">
                            <motion.div onClick={handleGoogleSignIn} whileTap={{scale:1.1}} className="google-button d-flex align-items-center justify-content-center">
                            <GoogleFill className="googleIcon"/><span className="ml-2 fw-bold">LOGIN WITH GOOGLE</span>
      
                            </motion.div>
                          </Col>
                    </Row>
                      </form>
                      <p className="sign_up-link text-center mt-5 pb-0 d-flex justify-content-center fw-bold">Don't Have Account Yet.? <motion.p whileHover={{scale:1.1}} className="pl-3 "> <Link to="/signup">REGISTER NOW</Link> </motion.p></p>
      
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
      )}
    </Helmet>
  );
};

export default Login;
