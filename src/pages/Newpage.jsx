import React from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cartAction } from "../redux/slices/cartSlice";
import AddFill from "remixicon-react/AddFillIcon";
import SubtractLine from "remixicon-react/SubtractLineIcon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Cart = () => {
  const data = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const totalQty = useSelector((state) => state.cart.totalQuantity);

  const dispatch = useDispatch();

  const addToCart = (item) => {
    dispatch(
      cartAction.addItem({
        id: item,
      })
    );
    toast.success("product have done add");
  };

  const removeFromCart = (item) => {
    dispatch(
      cartAction.deleteItem({
        id: item,
      })
    );
    toast.success("product have done Remove");
  };

  const deleteItem = (item) => {
    dispatch(
      cartAction.deleteItem({
        id: item,
      })
    );
    toast.success("Product Completely Deleted From Your Cart");
  };

  const handleCheckout = () => {
    if (totalQty === 0) {
      toast.error("Please Add Items To Cart First.!");
    } else {
      // Perform any other actions related to checkout
      // For example, navigate to the checkout page using history.push()
      // history.push("/checkout");
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  return (
    <Helmet title="Cart">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Cart</h1>
            </Col>
          </Row>
        </Container>
      </section>

    </Helmet>
  );
};

export default Cart;
