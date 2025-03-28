import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Helmet from "../../components/helmet/Helmet";
import { useParams } from "react-router-dom";
import useGetData from "../../custom_hooks/useGetData";
import { motion } from "framer-motion";
import { doc, deleteDoc, updateDoc, collection,addDoc,getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfigure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FallingLines } from "react-loader-spinner";



const OrderDetails = () => {
  const { id } = useParams();
  const { data, loading } = useGetData("orders");
  const { data: user, loading: userLoading } = useGetData("users");
  const { data:sales, loading:salesLoading } = useGetData("sales");

  const navigate = useNavigate();

  const orderFromOrders = data && !loading ? data.find((item) => item.id === id) : null;
  const orderFromSales = sales && !salesLoading ? sales.find((item) => item.id === id) : null;
  
  const order = orderFromOrders || orderFromSales;
  
  const userData =
    user && !userLoading ? (
      user.find((item) => item.userId || item.uid === order?.userId)
    ) : (
      <p>
        <FallingLines
          color="rgb(138, 61, 93)"
          width="50"
          visible={true}
          ariaLabel="falling-lines-loading"
        />
      </p>
    );
  

  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success("Order deleted successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      toast.error("Error deleting order:", error);
    }
  };

  const deleteSales = async (id) => {
    try {
      await deleteDoc(doc(db, "sales", id));
      toast.success("Order deleted successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      toast.error("Error deleting order:", error);
    }
  };

  const handleDecline = async (e, id) => {
    e.preventDefault();

    try {
      // Check if an image is selected for update

      // If no image is selected for update, only update other fields
      await updateDoc(doc(db, "orders", id), {
        state: "declined",
      });

      toast.success("Order Declined successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Error Declined Order:", error);
      toast.error(error.message);
    }
  };

  const handleAccept = async (e, id) => {
    e.preventDefault();

    try {
      // Check if an image is selected for update

      // If no image is selected for update, only update other fields
      await updateDoc(doc(db, "orders", id), {
        state: "accepted",
      });

      toast.success("Order Accepted successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Error Accepted Order:", error);
      toast.error(error.message);
    }
  };
  

  const handleComplete = async (e, id) => {
    e.preventDefault();

    try {
        // Update the order's state to "complete"
        await updateDoc(doc(db, "orders", id), {
            state: "complete",
        });

        // Get the updated order after updating the state
        const updatedOrder = await getDoc(doc(db, "orders", id));
        const orderData = updatedOrder.data();

        // Add the updated order details to the "sales" collection
        const docRef = await collection(db, "sales");
        await addDoc(docRef, orderData);

        toast.success("Order Accepted successfully");
        navigate("/dashboard/orders");
    } catch (error) {
        console.error("Error Accepted Order:", error);
        toast.error(error.message);
    }
};



  return (
    <Helmet title="Order Details">
      <section className="order_details-section ">
        <section className="user_details pt-0 pb-4">
          <Container className="user_container">
            <h3 className="text-center pb-5">
              <span> Order # </span>
              <span className="text-muted">{id}</span>
            </h3>
            <Row>
              <Col>
                <div className="user_img">
                  <h4 className="">User Image:</h4>
                  {order ? (
                    <img src={order?.userImg} />
                  ) : (
                    <FallingLines
                      color="rgb(138, 61, 93)"
                      width="50"
                      visible={true}
                      ariaLabel="falling-lines-loading"
                    />
                  )}
                </div>
              </Col>
              <Col className="d-flex justify-content-end">
                <div className="user_data">
                  <h4 className="">User Details:</h4>
                  <p>
                    <span className="fw-bold">Name: </span>{" "}
                    {order ? (
                      order.name
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Email: </span>{" "}
                    {order ? (
                      order.email
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Phone: </span>{" "}
                    {order ? (
                      order.phone
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="pt-0 mt-0 order_details">
          <Container>
            <Row className="pt-0">
              <Col>
                <div className="order_info">
                  <h5 className="">Deliver To:</h5>
                  <p>
                    <span className="fw-bold">Address: </span>{" "}
                    {order ? (
                      order.address
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Area: </span>{" "}
                    {order ? (
                      order.area
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Building: </span>{" "}
                    {order ? (
                      order.building
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Governorate: </span>{" "}
                    {order ? (
                      order.governorate
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                </div>
              </Col>
              <Col className="d-flex justify-content-end">
                <div className="order_info">
                  <h5 className="">Order Info:</h5>
                  <p>
                    <span className="fw-bold">State: </span>
                    {order ? (
                      order.state
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Total Items: </span>{" "}
                    {order ? (
                      order.totalQuantity
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    <span className="fw-bold">Total Price: </span>{" "}
                    {order ? (
                      order.totalAmount
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="table-responsive pt-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Qty.</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order && order.cartItems ? (
                        order.cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <img src={item.img} alt="" />
                            </td>
                            <td>
                              <p>{item.name}</p>
                            </td>
                            <td>
                              <p>{item.price}</p>
                            </td>
                            <td>
                              <p>{item.quantity}</p>
                            </td>
                            <td>
                              <p>{item.totalPrice}</p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">
                            <p className="d-flex align-items-center justify-content-center">
                              <FallingLines
                                color="rgb(138, 61, 93)"
                                width="50"
                                height="20"
                                visible={true}
                                ariaLabel="falling-lines-loading"
                              />
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="order_actions d-flex gap-2 align-items-center justify-content-around mt-5">
                {order ? (
                  order.state === "request" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="mr-5"
                        onClick={(e) => handleDecline(e, id)}
                      >
                        DECLINE
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => handleAccept(e, id)}
                      >
                        ACCEPT
                      </motion.button>
                    </>
                  ) : order.state === "declined" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="mr-5"
                      onClick={() => deleteOrder(id)}
                    >
                      DECLINE
                    </motion.button>
                  ) : order.state === "accepted" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="mr-5"
                        onClick={(e) => handleDecline(e, id)}
                      >
                        DECLINE
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => handleComplete(e, id)}
                      >
                        DELIVERD
                      </motion.button>
                    </>
                  ) : order.state === "complete" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="mr-5"
                        onClick={() => deleteSales(id)}
                      >
                        DELETE
                      </motion.button>
                    </>
                  ):null
                ) : null}
              </Col>
            </Row>
          </Container>
        </section>
      </section>
    </Helmet>
  );
};

export default OrderDetails;
