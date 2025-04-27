import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Helmet from "../components/helmet/Helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FallingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { auth } from "../firebaseConfigure";
import useGetData from "../custom_hooks/useGetData";
import InformationLine from "remixicon-react/InformationLineIcon";
import Search2Line from "remixicon-react/Search2LineIcon";

const OrdersUsers = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const authUser = auth.currentUser;
  const { data: users, loading: usersLoading } = useGetData("users");
  const { data: orders, loading: ordersLoading } = useGetData("orders");
  const [userOrders, setUserOrders] = useState([]);
  const [searchedOrders, setSearchedOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterItemsNum, setFilterItemsNum] = useState("all");

  useEffect(() => {
    if (users && authUser) {
      const firebaseUser = users.find((user) => user.userId === authUser.uid);
      setCurrentUser(firebaseUser || authUser);
    }
  }, [authUser, users]);

  useEffect(() => {
    if (orders && currentUser) {
      const filteredOrders = orders.filter(
        (order) =>
          order.userId === currentUser.uid || order.userId === currentUser.userId
      );
      setUserOrders(filteredOrders);
      setSearchedOrders(filteredOrders);
    }
  }, [orders, currentUser]);

  useEffect(() => {
    let filtered = [...userOrders];

    if (search.trim() !== "") {
      filtered = filtered.filter((order) =>
        order.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterState !== "all") {
      filtered = filtered.filter((order) => order.state === filterState);
    }

    if (filterDate) {
      filtered = filtered.filter((order) => order.orderDate === filterDate);
    }

    if (filterPrice !== "all") {
      filtered = filtered.filter((order) => {
        if (filterPrice === "low") return order.totalAmount < 50;
        if (filterPrice === "mid") return order.totalAmount >= 50 && order.totalAmount <= 200;
        if (filterPrice === "high") return order.totalAmount > 200;
        return true;
      });
    }

    if (filterItemsNum !== "all") {
      filtered = filtered.filter((order) => order.cartItems.length === parseInt(filterItemsNum));
    }

    setSearchedOrders(filtered);
  }, [search, filterState, filterDate, filterPrice, filterItemsNum, userOrders]);

  return (
    <Helmet title="Orders">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col>
              <h1 className="title text-white">My Orders</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="shop pt-5 pb-0 mt-0 mb-0">
  <Container>
    <div className="filters-card">
      <Row className="g-3 align-items-center">
        <Col xs={12} md={4}>
          <div className="search_box">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by id..."
            />
            <span><Search2Line className="searchIcon" /></span>
          </div>
        </Col>
        <Col xs={6} md={2}>
          <Form.Select onChange={(e) => setFilterState(e.target.value)} value={filterState}>
            <option value="all">All States</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={2}>
          <Form.Control
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            value={filterDate}
          />
        </Col>
        <Col xs={6} md={2}>
          <Form.Select onChange={(e) => setFilterPrice(e.target.value)} value={filterPrice}>
            <option value="all">All Prices</option>
            <option value="low">Below $50</option>
            <option value="mid">$50 - $200</option>
            <option value="high">Above $200</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={2}>
          <Form.Select onChange={(e) => setFilterItemsNum(e.target.value)} value={filterItemsNum}>
            <option value="all">All Items</option>
            <option value="1">1 Item</option>
            <option value="2">2 Items</option>
            <option value="3">3 Items</option>
            <option value="4">4 Items</option>
            <option value="5">5 Items</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  </Container>
</section>


      <section className="users_section pt-4">
        <Container>
          <Row>
            <Col>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Address</th>
                      <th>Date</th>
                      <th>Items Num.</th>
                      <th>Checkout</th>
                      <th>State</th>
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr className="text-center">
                        <td colSpan="7">
                          <FallingLines color="rgb(138, 61, 93)" width="50" height="20" visible={true} />
                        </td>
                      </tr>
                    ) : searchedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7"><p>No orders found.</p></td>
                      </tr>
                    ) : (
                      searchedOrders.map((order) => (
                        <tr key={order.id}>
                          <td><p>{order.id}</p></td>
                          <td><p>{order.area}, {order.governorate}</p><p>{order.address}</p></td>
                          <td><p>{order.orderDate}</p></td>
                          <td><p>{order.cartItems.length}</p></td>
                          <td><p>$ {order.totalAmount}</p></td>
                          <td><p>{order.state}</p></td>
                          <td>
                            <motion.span whileTap={{ scale: 1.2 }}>
                              <Link to={`/orders/${order.id}`}>
                                <InformationLine className="Icon" />
                              </Link>
                            </motion.span>
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

export default OrdersUsers;
