import React from "react";
import { Link } from "react-router-dom";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import furnitureExample from "../assets/pngwing.com (6).png";
import Services from "../components/services/services";
import Trendingproducts from "../components/trendingProducts/Trendingproducts";
import BestSales from "../components/bestsales/BestSales";
import TimerCount from "../components/timerCount/TimerCount";
import useGetData from "../custom_hooks/useGetData";
import ProductList from "../components/ui/ProductList";
import { FallingLines } from "react-loader-spinner";

const Home = () => {
  const year = new Date().getFullYear();

  const { data: newArrivales, loading: newArrivalesLoading } =
    useGetData("products");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [Trendingproducts, BestSales]);

  return (
    <Helmet title={"Home"}>
      <section className="home pt-0">
        <section className="hero_section">
          <Container>
            <Row>
              <Col lg={6} md={6} sm={6}>
                <div className="hero_content">
                  <p className="hero_subtitle">
                    Trending products in " {year} "
                  </p>
                  <h2>discover our wide collections now</h2>
                  <p className="p-hero">
                  Shop smarter, faster, and easier with One Stop – discover our wide collections now!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="shop_btn"
                  >
                    {" "}
                    <Link to="/shop">SHOP NOW</Link>{" "}
                  </motion.button>
                </div>
              </Col>

              <Col lg={6} md={6} sm={6}>
                <div className="hero_img">
                  <img src={furnitureExample} alt="furniture_example" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <Services />

        <section className="sections_website pt-5 mb-5">
          <Container>
            <Row>
              <Col className="sales">
                <div className="sales_section d-flex align-items-center"></div>
              </Col>
              <Col>
                <Row className="text-center">
                  <Col md={6} lg={6} sm={6}>
                    <div className="chairs_section d-flex align-items-top">
                      <p>Perfumes</p>
                    </div>
                  </Col>
                  <Col md={6} lg={6} sm={6}>
                    <div className="beds_section d-flex align-items-top">
                      <p>Beds</p>
                    </div>
                  </Col>
                </Row>
                <Row className="text-center">
                  <Col md={6} lg={6} sm={6}>
                    <div className="sofas_section d-flex align-items-top">
                      <p>Furnitures</p>
                    </div>
                  </Col>
                  <Col md={6} lg={6} sm={6}>
                    <div className="decorations_section d-flex align-items-top">
                      <p>Electronics</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="new_arrivals mb-5">
          <Container>
            <Row className="">
              <Col lg={12} className="text-center">
                <h2 className="section_title mb-5">New Arrivals</h2>
              </Col>
              {!newArrivales && !newArrivalesLoading ? (
                <Col className="text-center">
                  <div className="">
                    <h3 className="">No Data Found..</h3>
                  </div>
                </Col>
              ) : newArrivalesLoading ? (
                <Col className="text-center">
                  <FallingLines
                    color="rgb(138, 61, 93)"
                    width="50"
                    visible={true}
                    ariaLabel="falling-lines-loading"
                  />
                </Col>
              ) : (
                <ProductList data={newArrivales} />
              )}
            </Row>
          </Container>
        </section>
        <TimerCount className="" />

        <Trendingproducts />
        <BestSales />
      </section>
    </Helmet>
  );
};

export default Home;
