import React from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cartAction } from "../redux/slices/cartSlice";
import AddFill from "remixicon-react/AddFillIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
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
      <section className="cart_section">
        <Container>
          <Row>
            <Col md={12} lg={9}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Qty</th>
                    <th>Actions</th>
                  </thead>
                  <tbody>
                    {data.length == 0
                      ? "no products"
                      : data.map((item) => (
                          <tr key={item.id} >
                            <td>
                              <img src={item.img} alt="image product" />
                            </td>
                            <td>
                              <p>{item.name}</p>
                            </td>
                            <td>
                              <p className="fw-bold">$ {item.price}</p>
                            </td>
                            <td className="fw-bold">
                              <p>$ {item.totalPrice}</p>
                            </td>
                            <td>
                              <p>{item.quantity}</p>
                            </td>
                            <td>
                              <span>
                                <motion.span
                                  whileTap={{ scale: 1.2 }}
                                  className="pr-2 mt-5 addIcon"
                                  onClick={() => addToCart(item.id)}
                                >
                                  <AddFill className="addToCartIcon" />
                                </motion.span>
                              </span>
                              <span>
                                  <motion.span
                                    whileTap={{ scale: 1.2 }}
                                    className="pr-2 deleteIcon"
                                    onClick={() => deleteItem(item.id)}
                                  >
                                    <SubtractLine className="deleteFromCartIcon" />
                                  </motion.span>
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
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
                  <motion.button
                    className="checkButton"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleCheckout}
                  >
                    {totalQty === 0 ? (
                      <p style={{ lineHeight: "0px" }} className="pt-3 pb-0">
                        CHECKOUT
                      </p>
                    ) : (
                      <Link to="/checkout">CHECKOUT</Link>
                    )}
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

export default Cart;
