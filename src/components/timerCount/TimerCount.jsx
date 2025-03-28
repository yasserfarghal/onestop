import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import timerImage from "../../assets/pngwing.com (8).png";
import {motion} from 'framer-motion'
import Clock from "../ui/Clock";
const TimerCount = () => {
  return (
    <section className="timer_count">
      <Container>
        <Row>
          <Col className="count_down-col justify-content-center">
            <div className="clock_top-content">
                <h4 className="mb-2 mt-5">Limited Offers</h4>
                <h3>Quailty Armchair</h3>
            </div>

            <Clock/>

            <motion.button whileHover={{scale:1.1}} className="buy_button">
                <Link to="/shop">
                    Visit Shop
                </Link>
            </motion.button>

          </Col>

          <Col className="timer_image-holder">
            <img src={timerImage} alt="product_image" className="timerImage" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TimerCount;
