import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Helmet from "../components/helmet/Helmet";
import useAuth from "../custom_hooks/useAuth";
import { FallingLines } from "react-loader-spinner";
import userImg from "../assets/149071.png";
import useGetData from "../custom_hooks/useGetData";
import { motion } from "framer-motion";
import InformationLine from "remixicon-react/InformationLineIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { authActions } from "../redux/slices/authSlice";

const Profile = () => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const authUser = useAuth().currentUser;
  const { data: users, loading: usersLoading } = useGetData("users");
  const { data: orders, loading: ordersLoading } = useGetData("orders");
  const [userOrders, setuserOrders] = React.useState(null);
  const reduxUser = useSelector((state) => state.auth.currentUser);

  console.log(reduxUser);

  const firebaseUsers =
    users && !usersLoading && users.find((item) => item.userId === authUser.uid)
      ? true
      : null;

  const ordersUser =
    orders &&
    !ordersLoading &&
    orders.filter(
      (item) => item.userId === currentUser.uid || currentUser.userId
    )
      ? true
      : null;

  React.useEffect(() => {
    if (firebaseUsers !== null) {
      setCurrentUser(firebaseUsers);
    } else if (firebaseUsers === null) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  const getProviderDisplayName = (providerId) => {
    switch (providerId) {
      case "google.com":
        return "Google";
      // Add more cases for other providers if needed
      default:
        return "Unknown";
    }
  };

  const [tab, setTab] = React.useState("orders");

  return (
    <Helmet title="Profile">
      <section className="user_profile-details pt-0 pb-4">
        <Container className="user_container">
          <h3 className="text-center pb-3 mt-5">
            <span> Profile </span>
          </h3>
          <Row>
            <Col lg={2} sm={12} md={2}>
              <div className="user_img">
                {currentUser &&
                currentUser.photoURL !== null &&
                currentUser.img !== null ? (
                  <img src={currentUser.photoURL} alt="User Profile1" />
                ) : currentUser &&
                  currentUser.photoURL === null &&
                  currentUser.img !== null ? (
                  <img src={currentUser.img} alt="User Profile2" />
                ) : currentUser &&
                  usersLoading &&
                  currentUser.photoURL === null &&
                  currentUser.img === null ? (
                  <FallingLines
                    color="rgb(138, 61, 93)"
                    width="50"
                    visible={true}
                    ariaLabel="falling-lines-loading"
                  />
                ) : (
                  <img src={userImg} alt="Default User Profile" />
                )}
              </div>
            </Col>
            <Col lg={10} sm={12} md={10} className="d-flex align-items-center">
              <div className="user_data pt-4">
                <p>
                  <span className="fw-bold">Name: </span>
                  {currentUser &&
                  (currentUser.displayName !== null ||
                    currentUser.Name !== null ||
                    (reduxUser && reduxUser.displayName !== null)) ? (
                    currentUser.displayName ||
                    currentUser.Name ||
                    reduxUser?.displayName
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
                  {currentUser && currentUser.email !== null ? (
                    <span>
                      <span className="fw-bold">Email: </span>
                      {currentUser.email}
                    </span>
                  ) : currentUser && currentUser.providerData.length > 0 ? (
                    <span>
                      <span className="fw-bold">Login By: </span>
                      {getProviderDisplayName(
                        currentUser.providerData[0].providerId
                      )}{" "}
                      Account
                    </span>
                  ) : (
                    <FallingLines
                      color="rgb(138, 61, 93)"
                      width="20"
                      visible={true}
                      ariaLabel="falling-lines-loading"
                    />
                  )}
                </p>
                {currentUser &&
                (currentUser.phone || currentUser.phoneNumber) ? (
                  <p>
                    <span className="fw-bold">Phone: </span>
                    {currentUser.phone || currentUser.phoneNumber}
                  </p>
                ) : null}
                <Row>
                  {firebaseUsers === null &&
                  currentUser &&
                  getProviderDisplayName(
                    currentUser.providerData[0].providerId
                  ) !== "Unknown" ? (
                    <Col lg={6} md={6} sm={12}>
                      <div className="actions_buttons">
                        <button>Join To Tagline Members</button>
                      </div>
                    </Col>
                  ) : (
                    <>
                      <Col lg={6} md={6} sm={12}>
                        <div className="actions_buttons">
                          <button>Edit Image</button>
                        </div>{" "}
                      </Col>
                      <Col lg={6} md={6} sm={12}>
                        <div className="actions_buttons2">
                          <button>Edit Account</button>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>

        <Container className="mt-4">
          <Row>
            <Col md={6} lg={4}>
              <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                <span></span>
                <div className="services_desc">
                  <h3>Orders</h3>
                  <h4 className=" text-muted">14</h4>
                </div>
              </motion.div>
            </Col>

            <Col md={6} lg={4}>
              <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                <span></span>
                <div className="services_desc">
                  <h3>Checkedout</h3>
                  <h4 className=" text-muted">14</h4>
                </div>
              </motion.div>
            </Col>

            <Col md={6} lg={4}>
              <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                <span></span>
                <div className="services_desc">
                  <h3>Favourites</h3>
                  <h4 className=" text-muted">14</h4>
                </div>
              </motion.div>
            </Col>
          </Row>

          <Row>
            <Col lg={8} md={8} sm={12}>
              <section className="tab_section mt-2 pt-4">
                <Container>
                  <Row>
                    <Col md={12} lg={12}>
                      <div className="tab_wrapper d-flex align-items-center gap-5">
                        <motion.h5
                          whileTap={{ scale: 1.1 }}
                          className={`pr-4 ${
                            tab === "orders" ? "active_tab" : ""
                          }`}
                          onClick={() => setTab("orders")}
                        >
                          Orders
                        </motion.h5>
                        <motion.h5
                          whileTap={{ scale: 1.1 }}
                          className={`pr-4 ${
                            tab === "favourites" ? "active_tab" : ""
                          }`}
                          onClick={() => setTab("favourites")}
                        >
                          Favourites
                        </motion.h5>
                        <motion.h5
                          whileTap={{ scale: 1.1 }}
                          className={tab === "checkedout" ? "active_tab" : ""}
                          onClick={() => setTab("checkedout")}
                        >
                          Checkedout
                        </motion.h5>
                      </div>
                      <div className="tab_content">
                        {tab === "orders" ? (
                          <>

                          <div className="d-flex align-items-center justify-content-between mt-4">
                          <h5 className="">Orders</h5>

<div className="filter_widget">
<label htmlFor="filter" className="pr-2">
Filter By State
</label>
<select id="filter" >
<option value="all">All</option>
<option value="request">Requested</option>
<option value="declined">Declined</option>
<option value="accepted">Accepted</option>
<option value="complete">Completed</option>
</select>
</div>
                          </div>

                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <th>ID</th>
                                  <th>Items Qty</th>
                                  <th>Total Price</th>
                                  <th>State</th>
                                  <th>Actions</th>
                                </thead>
                                <tbody>
                                  {orders &&
                                  orders.filter(
                                    (item) =>
                                      item.userId === currentUser.uid ||
                                      currentUser.userId
                                  ).length === 0 &&
                                  !ordersLoading ? (
                                    <tr>
                                      <h4>There is no orders</h4>
                                    </tr>
                                  ) : ordersLoading ? (
                                    <tr>
                                      <h4>please wait orders...</h4>
                                    </tr>
                                  ) : (
                                    orders
                                      .filter(
                                        (item) =>
                                          item.userId === currentUser.uid ||
                                          currentUser.userId
                                      )
                                      .map((item) => (
                                        <tr key={item.id}>
                                          <td>{item.id}</td>
                                          <td>{item.cartItems.length + 1}</td>
                                          <td>{item.totalAmount}</td>
                                          <td>{item.state}</td>
                                          <td className="d-flex align-items-center justify-content-between">
                                            <span className="mr-3">
                                              <motion.span
                                                whileTap={{ scale: 1.2 }}
                                                className="pr-2"
                                              >
                                                <Link
                                                  to={`/dashboard/orders/${item.id}`}
                                                >
                                                  <InformationLine className="Icon" />
                                                </Link>
                                              </motion.span>
                                            </span>
                                            <span>
                                              <motion.span
                                                whileTap={{ scale: 1.2 }}
                                                className="pr-2"
                                              >
                                                <DeleteBinLine className="Icon" />
                                              </motion.span>
                                            </span>
                                          </td>
                                        </tr>
                                      ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : tab === "favourites" ? (
                          <p>favourites</p>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </section>
            </Col>

            <Col lg={4} md={4} sm={12}>
              <div className="preparing_orders pt-4 mt-2">
                <h5>Upcoming Delivery</h5>
                <div className="order"></div>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col lg={8} md={8} sm={12}></Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Profile;
