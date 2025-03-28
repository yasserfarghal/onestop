import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductList from "../ui/ProductList.jsx";
import useGetData from "../../custom_hooks/useGetData.js";
import { FallingLines } from "react-loader-spinner";


function BestSales() {
  const { data: products, loading } = useGetData("products");
  const { data: sales, loading: salesLoading } = useGetData("sales");

  // Rename the variable to avoid conflict
  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length < 0) {
        return 0; // If there are no feedbacks, return 0 as the average rating
    }

    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    const averageRating = Math.floor(totalRating / feedbacks.length+2);
    return averageRating;
};

const filteredProducts = products.filter(item => {
  // Check if any item in the sales data contains a cartItem with the same id
  return products.some(item=> calculateAverageRating(item.feedbacks)>=10);
});






  return (
    <>
              {
        filteredProducts.length===0? null: (
          <section className="trending_products">

          <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2 className="section_title mb-5">Best Sales</h2>
            </Col>
            {loading ? <>
              <FallingLines
  color="rgb(138, 61, 93)"
  width="50"
  visible={true}
  ariaLabel="falling-lines-loading"
/>;
              </> : <ProductList data={filteredProducts} />}
          </Row>
        </Container>
            </section>

        )
      }
    </>
  );
}

export default BestSales;
