import React from "react";
import logo from '../../assets/furniture-logo_23-2148613625.avif'
import { Container, Row, Col , ListGroup , ListGroupItem } from "react-bootstrap";
import {  Link } from "react-router-dom";
import MapPinLine from 'remixicon-react/MapPinLineIcon'
import PhoneLine from 'remixicon-react/PhoneLineIcon'
import MailLine from 'remixicon-react/MailLineIcon'

const Footer = () => {
  
  const year = new Date().getFullYear()

  return (
    <footer className="mt-5 footer">
      <Container>
        <Row>
          <Col lg={4} md={4} className="mb-3">
          <div className="logo mb-1">
              <Link to="home">
                <img src={logo} alt="logo" className="img" />
              </Link>
              <div>
                <h1>TAGLINE</h1>
              </div>
            </div>

            <p className="footer_text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, fugiat obcaecati, 
              culpa excepturi maxime explicabo doloremque ipsam nihil expedita, voluptas nesciunt 
              dignissimos dolore voluptatum minima quisquam. Sequi possimus est quam?
            </p>
          </Col>

          <Col lg={2} md={2} className="mb-3">
            <div className="footer_quick-links">
              <h4 className="quick_links-title pl-3 mb-1">Useful Links</h4>
              <ListGroup className="footerLinks_wrapper">

                <ListGroupItem className="footerLink">
                  <Link to="/shop">Shop</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="/cart">Cart</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="/login">Login</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="/signup">Register</Link>
                </ListGroupItem>

              </ListGroup>
            </div>
          </Col>

          <Col lg={3} md={3} className="mb-3">
          <div className="footer_quick-links">
              <h4 className="quick_links-title pl-3 mb-1">Top Categories</h4>
              <ListGroup className="footerLinks_wrapper">

                <ListGroupItem className="footerLink">
                  <Link to="#">Chairs</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="#">Sofas</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="#">Desks</Link>
                </ListGroupItem>

                <ListGroupItem className="footerLink">
                  <Link to="#">Beds</Link>
                </ListGroupItem>

              </ListGroup>
            </div>
          </Col>

          <Col lg={3} md={3} className="mb-3">
          <div className="footer_quick-links contact-links">
              <h4 className="quick_links-title pl-3 mb-1">Contact</h4>
              <ListGroup className="footerLinks_wrapper">

                <ListGroupItem className="footerLink d-flex">
                  <span>
                    <MapPinLine className="contactIcons"/>
                  </span>
                  <p>123 zamalek, cairo</p>
                </ListGroupItem>

                <ListGroupItem className="footerLink d-flex">
                  <span>
                    <PhoneLine className="contactIcons"/>
                  </span>
                  <p>+01553355475</p>
                </ListGroupItem>

                <ListGroupItem className="footerLink d-flex">
                  <span>
                    <MailLine className="contactIcons" />
                  </span>
                  <p>Yasserfarghal@gmail.com</p>
                </ListGroupItem>


              </ListGroup>
            </div>
          </Col>
          
          <Col lg={12} md={12}>
            <p className="footer_copyRight text-center">
              Copyright {year} developed by <span>Yasser Farghal.</span> All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
