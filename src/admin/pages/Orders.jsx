import React from "react";
import useGetData from "../../custom_hooks/useGetData";
import { Container, Row, Col } from "react-bootstrap";
import Helmet from "../../components/helmet/Helmet";
import { motion } from "framer-motion";
import { doc, deleteDoc } from "firebase/firestore";
import InformationLine from "remixicon-react/InformationLineIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfigure";
import {FallingLines} from 'react-loader-spinner'
import Search2Line from "remixicon-react/Search2LineIcon";


const Orders = () => {
  const { data, loading } = useGetData("orders");
  const { data:sales, loading:salesLoading } = useGetData("sales");

  const [orders, setOrders] = React.useState(null);
  const { data: user, loading: userLoading } = useGetData("users");

  const [searchedUser, setSearchedUser] = React.useState(null);

  const handleFilter = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "requested") {
      const filterProducts = data.filter((item) => item.state === "request");
      setSearchedUser(null); // Clear any previous search results
      setOrders(filterProducts);
    } else if (filterValue === "acceptRequests") {
      const filterProducts = data.filter((item) => item.state === "accepted");
      setSearchedUser(null); // Clear any previous search results
      setOrders(filterProducts);
    }else if (filterValue === "declinedRequests") {
      const filterProducts = data.filter((item) => item.state === "declined");
      setSearchedUser(null); // Clear any previous search results
      setOrders(filterProducts);
    }else if (filterValue === "doneRequests") {
      const filterProducts = sales;
      setSearchedUser(null); // Clear any previous search results
      setOrders(filterProducts);
    } else if (filterValue === "") {
      setOrders(null); // Set back to the original orders data
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      setSearchedUser(null);
    } else {
      const searchUser = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchedUser(searchUser);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <Helmet title="Orders">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Orders</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="shop pb-0 mt-0 pt-5 mb-0">
        <Container>
          <Row>
            <Col>
              <div className="filter_widget">
                <label htmlFor="filter" className="pr-2">
                  Filter By State
                </label>
                <select id="filter" onChange={handleFilter}>
                  <option value="">All</option>
                  <option value="requested">Requests</option>
                  <option value="acceptRequests">Accept</option>
                  <option value="doneRequests">Complete</option>
                  <option value="declinedRequests">Decline</option>
                </select>
              </div>
            </Col>

            <Col>
              <div className="search_box">
                <input
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search By User Name..."
                />
                <span><Search2Line className="searchIcon" /></span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="users_section pt-4">
        <Container>
          <Row>
            <Col md={12} lg={12}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Items Num.</th>
                      <th>Checkout</th>
                      <th>State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(item=>item.state !== "complete").length === 0&&orders===null && !loading ? (
                      <tr>
                        <td>
                          <p>There is No Orders..</p>
                        </td>
                      </tr>
                    ) : loading ? (
                      <tr className="text-center" >
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
                    ) : searchedUser === null && orders === null ? (
                      data.filter(item=>item.state!== "complete").map((item) => (
                        <tr key={item.id}>
                          <td>
                            <p>{item.name}</p>
                          </td>
                          <td>
                            <p>{item.email}</p>
                          </td>
                          <td>
                            <p>{item.cartItems.length}</p>
                          </td>
                          <td>
                            <p>$ {item.totalAmount}</p>
                          </td>
                          <td>
                            <p>{item.state}</p>
                          </td>
                          <td className="d-flex align-items-center justify-content-between">
                            <span className="mr-3">
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                              >
                                <Link to={`/dashboard/orders/${item.id}`}>
                                  <InformationLine className="Icon" />
                                </Link>
                              </motion.span>
                            </span>
                            <span>
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                                onClick={() => deleteDocument(item.id)}
                              >
                                <DeleteBinLine className="Icon" />
                              </motion.span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : orders !== null && orders.length > 0 ? (
                      orders.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <p>{item.name}</p>
                          </td>
                          <td>
                            <p>{item.email}</p>
                          </td>
                          <td>
                            <p>{item.cartItems.length}</p>
                          </td>
                          <td>
                            <p>$ {item.totalAmount}</p>
                          </td>
                          <td>
                            <p>{item.state}</p>
                          </td>
                          <td className="d-flex align-items-center justify-content-between">
                            <span className="mr-3">
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                              >
                                <Link to={`/dashboard/orders/${item.id}`}>
                                  <InformationLine className="Icon" />
                                </Link>
                              </motion.span>
                            </span>
                            <span>
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                                onClick={() => deleteDocument(item.id)}
                              >
                                <DeleteBinLine className="Icon" />
                              </motion.span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : searchedUser === null || searchedUser.length === 0 ? (
                      <tr>
                        <td colSpan="6">
                          <p>There Is No Order Match..</p>
                        </td>
                      </tr>
                    ) : (
                      searchedUser.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <p>{item.name}</p>
                          </td>
                          <td>
                            <p>{item.email}</p>
                          </td>
                          <td>
                            <p>{item.cartItems.length}</p>
                          </td>
                          <td>
                            <p>$ {item.totalAmount}</p>
                          </td>
                          <td>
                            <p>{item.state}</p>
                          </td>
                          <td className="d-flex align-items-center justify-content-between">
                            <span className="mr-3">
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                              >
                                <Link to={`/OrderDetails${item.id}`}>
                                  <InformationLine className="Icon" />
                                </Link>
                              </motion.span>
                            </span>
                            <span>
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                                onClick={() => deleteDocument(item.id)}
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
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Orders;
