import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import useGetData from "../../custom_hooks/useGetData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: users } = useGetData("users");
  const { data: products } = useGetData("products");
  const { data: orders } = useGetData("orders");
  const { data: sales } = useGetData("sales");


  const totalSales = sales
    ? sales
        .filter((item) => item.state === "complete")
        .reduce((total, order) => total + order.totalAmount, 0)
    : 0;
  


  return (
    <section className="services pt-0">
      <Container>
        <Row>
          <Col md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.1 }} className="service_item">
              <div className="services_desc">
                <h3>Total Sales</h3>
                <h1>$ {totalSales}</h1>
              </div>
            </motion.div>
          </Col>

          <Col md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.1 }} className="service_item">
              <div className="services_desc">
                <h3>Total Orders</h3>
                <h1>{orders.filter(item=>item.state!== "complete").length}</h1>
              </div>
            </motion.div>
          </Col>

          <Col md={6} lg={3}>
            <div to="All-Users">
              <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                <div className="services_desc">
                  <h3>Users</h3>
                  <h1>{users.length}</h1>
                </div>
              </motion.div>
            </div>
          </Col>

          <Col md={6} lg={3}>
            <div to="All-Products">
            <motion.div whileHover={{ scale: 1.1 }} className="service_item">
              <div className="services_desc">
                <h3>Products</h3>
                <h1>{products.length}</h1>
              </div>
            </motion.div>
            </div>

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
