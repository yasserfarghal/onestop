import React from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../custom_hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfigure";
import { toast } from "react-toastify";
import { cartAction } from "../redux/slices/cartSlice";
import useGetData from "../custom_hooks/useGetData";


const Checkout = () => {

  const dispatch =useDispatch()

  const navigate = useNavigate();

  const {currentUser} = useAuth();

  const {data:users , loading:usersLoading} = useGetData("users")
  const data = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const totalQty = useSelector((state) => state.cart.totalQuantity);

  const [loading, setLoading] = React.useState(false);

  const [order, setOrder] = React.useState({
    name: "",
    governorate: "",
    area: "",
    phone: "",
    address: "",
    building: "",
  });

  const [quickEmail, setQuickEmail] = React.useState('');

  const usersFromFirebaseCollection = users? users.find(item=>item.Email ===quickEmail) : null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitter = async (e) => {
    e.preventDefault();
  
    if (!currentUser) {
      navigate("/login");
    } else if (
      order.name === "" ||
      order.address === "" ||
      order.area === "" ||
      order.building === "" ||
      order.governorate === "" ||
      order.phone === ""
    ) {
      toast.error("Please Complete Your Information");
    } else {
      try {
        // Create a reference to the 'orders' collection in Firestore
        const docRef = collection(db, "orders");
  
        // Combine form data and cart data to form the complete order
        const orderData = {
          ...order,
          cartItems: data,
          totalAmount: totalPrice,
          totalQuantity: totalQty,
          userId: currentUser ? currentUser.uid : null,
          email:  currentUser&&currentUser.email!== null ? currentUser.email : quickEmail,
          state:"request",
          userImg: currentUser ? currentUser.photoURL : null
        };
  
        // Save the order data to Firestore using the 'addDoc' function
        await addDoc(docRef, orderData);

        if(usersFromFirebaseCollection === null ){

          const docRef = collection(db, "users");

          const orderData = {
            userId: currentUser ? currentUser.uid : null,
            email:  currentUser&&currentUser.email!== null ? currentUser.email : quickEmail,
            state:"request",
            userImg: currentUser ? currentUser.photoURL : null
          };
    
          // Save the order data to Firestore using the 'addDoc' function
          await addDoc(docRef, orderData);


        }
  
        toast.success("Order Sent. Please Wait Until Communication With You");
        dispatch(cartAction.resetCart())
        navigate("..")

      } catch (error) {
        console.error("Error submitting order to Firestore:", error);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <Helmet title="Checkout">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Checkout</h1>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="cart_section">
        <Container>
          <Row>
            <Col md={12} lg={9}>
              <form className="container mb-3">
                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Please enter your name"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                {
                  currentUser&&currentUser.email === null ? (
                    <Row className="mb-3">
                    <Form.Group controlId="formBasicEmail" className="col">
                      <Form.Label className="fw-bold">Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Please enter your email"
                        onChange={(e) => { setQuickEmail(e.target.value) }}
                      />
                    </Form.Group>
                  </Row>
                  ):null
                }

                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Governorate</Form.Label>
                    <Form.Select
                      className="form-control"
                      name="governorate"
                      onChange={handleChange}
                    >
                      <option>Select Gover.</option>
                      <option value="cairo">Cairo</option>
                      <option value="alex">Alexandria</option>
                      <option value="azt">Assuit</option>
                      <option value="giza">Giza</option>
                      <option value="aswan">Asswan</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Area</Form.Label>
                    {order.governorate == "cairo" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}
                      >
                        <option>Select Area</option>
                        <option value="cairo">Zamalek</option>
                        <option value="alex">El-Mohandessen</option>
                        <option value="azt">Al-Agouza</option>
                        <option value="giza">Ain-Shamms</option>
                      </Form.Select>
                    ) : order.governorate == "alex" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                        <option value="cairo">Cairo</option>
                        <option value="alex">Alexandria</option>
                        <option value="azt">Assuit</option>
                        <option value="giza">Giza</option>
                        <option value="aswan">Asswan</option>
                      </Form.Select>
                    ) : order.governorate == "alex" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                        <option value="cairo">Cairo</option>
                        <option value="alex">Alexandria</option>
                        <option value="azt">Assuit</option>
                        <option value="giza">Giza</option>
                        <option value="aswan">Asswan</option>
                      </Form.Select>
                    ) : order.governorate == "azt" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                        <option value="cairo">Cairo</option>
                        <option value="alex">Alexandria</option>
                        <option value="azt">Assuit</option>
                        <option value="giza">Giza</option>
                        <option value="aswan">Asswan</option>
                      </Form.Select>
                    ) : order.governorate == "giza" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                        <option value="cairo">Cairo</option>
                        <option value="alex">Alexandria</option>
                        <option value="azt">Assuit</option>
                        <option value="giza">Giza</option>
                        <option value="aswan">Asswan</option>
                      </Form.Select>
                    ) : order.governorate == "aswan" ? (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                        <option value="cairo">Cairo</option>
                        <option value="alex">Alexandria</option>
                        <option value="azt">Assuit</option>
                        <option value="giza">Giza</option>
                        <option value="aswan">Asswan</option>
                      </Form.Select>
                    ) : (
                      <Form.Select className="form-control" name="area" onChange={handleChange}>
                        <option>Select Area</option>
                      </Form.Select>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Phone</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="+20XXXXXXXXXX"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Address</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Your Address"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group controlId="formBasicEmail" className="col">
                    <Form.Label className="fw-bold">Building</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      name="building"
                      placeholder="Building Name/ Apartment No./ Floors No."
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <motion.button
                  whileTap={{ scale: 1.1 }}
                  onClick={handleSubmitter}
                  className="orderButton"
                >
                  ORDER NOW
                </motion.button>
              </form>
            </Col>

            <Col md={12} lg={3} className="mt-4">
              <div className="reciet">
                <h5 className="section_title text-center">Cart Receit</h5>
                <div className="receit_info">
                  <h6 className="fw-bold">
                    Products Added:{" "}
                    <span className="text-muted">{data.length}</span>
                  </h6>
                  <h6 className="fw-bold">
                    Total Price:{" "}
                    <span className="text-muted">{totalPrice}</span>
                  </h6>
                  <h6 className="fw-bold">
                    Total Items: <span className="text-muted">{totalQty}</span>
                  </h6>
                </div>
                <div className="reciet_action d-flex align-items-center justify-content-between flex-column">
                  <motion.button
                    className="shopButton"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Link className="text-white" to="/shop">
                      SHOPPING
                    </Link>
                  </motion.button>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
