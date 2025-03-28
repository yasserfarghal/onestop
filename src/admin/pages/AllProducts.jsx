import React from "react";
import useGetData from "../../custom_hooks/useGetData";
import Helmet from "../../components/helmet/Helmet";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import InformationLine from "remixicon-react/InformationLineIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import { Link } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfigure";
import StarSFill from "remixicon-react/StarSFillIcon";
import {FallingLines} from 'react-loader-spinner'


const AllProducts = () => {
  const { data, loading } = useGetData("products");

  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return 0; // If there are no feedbacks, return 0 as the average rating
    }

    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    const averageRating = Math.floor(totalRating / feedbacks.length);
    return averageRating;
  };

  const [filter, setFilter] = React.useState(null);

  const products = data
    ? filter == null
      ? data
      : data.filter((item) => item.category === filter)
    : [];

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [products]);

  return (
    <Helmet title={`${filter == null ? "All" : filter} Products`}>
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">
                {filter == null ? "All" : filter} Products
              </h1>
            </Col>
          </Row>
        </Container>
      </section>

      <div className="mt-3 text-center filter_products-page">
  <Container>
    <Row>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === null ? "active_filter" : ""}
          onClick={() => setFilter(null)}
        >
          All
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "perfume" ? "active_filter" : ""}
          onClick={() => setFilter("perfume")}
        >
          Perfume
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "electronics" ? "active_filter" : ""}
          onClick={() => setFilter("electronics")}
        >
          Electronics
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "furniture" ? "active_filter" : ""}
          onClick={() => setFilter("furniture")}
        >
          Furniture
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "watches" ? "active_filter" : ""}
          onClick={() => setFilter("watches")}
        >
          Watches
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "clothes" ? "active_filter" : ""}
          onClick={() => setFilter("clothes")}
        >
          Clothes
        </motion.button>
      </Col>
      <Col>
        <motion.button
          whileTap={{ scale: 1.1 }}
          className={filter === "beauty" ? "active_filter" : ""}
          onClick={() => setFilter("beauty")}
        >
          Beauty
        </motion.button>
      </Col>
    </Row>
  </Container>
</div>


      <section className="product_section">
        <Container>
          <Row>
            <Col md={12} lg={12}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Cat.</th>
                      <th>Desc</th>
                      <th>Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 && !loading ? (
                      <tr>
                        <td colSpan="6">
                          <h5>There Are No Products.</h5>
                        </td>
                      </tr>
                    ) :products && loading ? (
                      <tr>
                        <td colSpan="6">
                        <p className="d-flex align-items-center justify-content-center">
                          <FallingLines
                            color="rgb(138, 61, 93)"
                            width="50"
                            height="20"
                            visible={true}
                            ariaLabel="falling-lines-loading"
                          />
                          </p>                        </td>
                      </tr>
                    ) : (
                      products.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img src={item.img} alt="image product" />
                          </td>
                          <td>
                            <p>{item.name}</p>
                          </td>
                          <td>
                            <p className="fw-bold">$ {item.price}</p>
                          </td>
                          <td>
                            <p className="">{item.category}</p>
                          </td>
                          <td>
                            <p className="">{item.shortDesc}</p>
                          </td>
                          <td>
                            <p className="d-flex align-items-center text-muted">( {calculateAverageRating(item.feedbacks)} ) <StarSFill className="starIcon"/></p>
                          </td>
                          <td>
                            <span>
                              <motion.span
                                whileTap={{ scale: 1.2 }}
                                className="pr-2"
                              >
                                <Link to={`/dashboard/All-Products/${item.id}`}>
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

export default AllProducts;
