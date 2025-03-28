import React from "react";
import Helmet from "../components/helmet/Helmet";
import { Container, Row, Col } from "react-bootstrap";
import AddFill from "remixicon-react/AddFillIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import SubtractLine from "remixicon-react/SubtractLineIcon";

import {motion} from "framer-motion"
const Favourites = () => {
  return (
    <Helmet title="Favourites">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Favourites</h1>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col>
              <div className="table-responsive">
                <table className="table-responsive">
                  <thead>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </thead>
                  <tbody>
                  <tr >
                            <td>
                              <img src="" alt="image product" />
                            </td>
                            <td>
                              <p>""</p>
                            </td>
                            <td>
                              <p className="fw-bold">$ p</p>
                            </td>
                            <td className="fw-bold">
                              <p>$ p</p>
                            </td>
                            <td>
                              <p></p>
                            </td>
                            <td>
                              <span>
                                <motion.span
                                  whileTap={{ scale: 1.2 }}
                                  className="pr-2 mt-5 addIcon"
                                >
                                  <AddFill className="addToCartIcon" />
                                </motion.span>
                              </span>
                              <span>
                                  <motion.span
                                    whileTap={{ scale: 1.2 }}
                                    className="pr-2 deleteIcon"
                                  >
                                    <SubtractLine className="deleteFromCartIcon" />
                                  </motion.span>
                              </span>
                            </td>
                          </tr>
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

export default Favourites;
