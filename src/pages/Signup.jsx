import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Helmet from "../components/helmet/Helmet";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebaseConfigure";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc,doc,setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    img: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle file input separately
    if (type === "file") {
      const file = e.target.files[0]; // Get the first selected file
      setUser((prevState) => ({
        ...prevState,
        [name]: file, // Store the selected file object
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmitter = async (e) => {
    e.preventDefault();
  
    if (!user.email || !user.password) {
      toast.error("Please enter both email and password.");
    } else if (!isValidEmail(user.email)) {
      toast.error("Please enter a valid email address.");
    } else if (user.password.length < 6) {
      toast.error("Password should be at least 6 characters long.");
    } else {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
        const newUser = userCredential.user; // Get the user object from userCredential
  
        // Upload image to Firebase Storage if image exists
        let downloadURL = null;
        if (user.img) {
          const storageRef = ref(storage, `images/${user.name}`);
          const uploadImg = uploadBytesResumable(storageRef, user.img);
  
          // Wait for the image upload to finish
          await uploadImg;
  
          // Get the download URL of the uploaded image
          downloadURL = await getDownloadURL(uploadImg.snapshot.ref);
        }
  
        // Update displayName and photoURL
        await updateProfile(newUser, {
          displayName: user.name,
          photoURL: downloadURL || "",
        });
  
        // Add the user data to Firebase Firestore
        const userData = {
          Name: user.name,
          Email: user.email,
          Password: user.password,
          img: downloadURL || "", // Handle the case if there's no image
          userId: newUser.uid,
        };
        await addDoc(collection(db, "users"), userData);
  
        // Initialize the favorites subcollection for the new user
        const favoritesRef = doc(db, "users", newUser.uid, "favorites", "userFavorites");
        await setDoc(favoritesRef, {});  // Empty object or any initial data you prefer
  
        setUser({
          name: "",
          email: "",
          password: "",
          img: null, // Reset the img state to null after registering
        });
        toast.success("Account Created!");
  
        // Navigate to login page after successful registration
        navigate("/login");
      } catch (error) {
        console.error("Error creating account or adding user data:", error);
        toast.error("Error creating account or adding user data.");
      }
    }
  };
  

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Helmet title="Registering">
      <section className="login">
        <Container>
          <Row>
            <Col>
              <div className="login_form">
                <div className="text-center">
                  <h5 className="section_title">REGISTER NOW</h5>
                  <p>Register now with us for FREE.</p>
                </div>

                <form className="container mb-3">
                  <Row className="mb-3">
                    <Form.Group controlId="formBasicEmail" className="col">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Please enter your name"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group controlId="formBasicEmail" className="col">
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
                  <Row className="mb-3">
                    <Form.Group controlId="formBasicEmail" className="col">
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
                  <Row className="mb-3">
                    <Form.Group controlId="formBasicEmail" className="col">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="img"
                        onChange={handleChange}
                        className="form-control"
                      />
                    </Form.Group>
                  </Row>
                  <motion.button
                    onClick={handleSubmitter}
                    whileTap={{ scale: 1.1 }}
                  >
                    REGISTER
                  </motion.button>
                </form>
                <p className="text-center mt-5 pb-0 d-flex justify-content-center fw-bold">
                  Have Account Already.?{" "}
                  <motion.p whileHover={{ scale: 1.1 }} className="pl-3 ">
                    <Link to="/login">LOGIN</Link>
                  </motion.p>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
