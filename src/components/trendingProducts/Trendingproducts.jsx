import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductList from "../ui/ProductList.jsx";
import useGetData from "../../custom_hooks/useGetData.js";

function Trendingproducts() {
  const { data: products, loading } = useGetData("products");
  const { data: sales, loading: salesLoading } = useGetData("sales");

  // Create a mapping of product IDs to their count in sales
  const productSalesCountMap = sales.reduce((countMap, sale) => {
    sale.cartItems.forEach(cartItem => {
      if (countMap[cartItem.id]) {
        countMap[cartItem.id]++;
      } else {
        countMap[cartItem.id] = 1;
      }
    });
    return countMap;
  }, {});

  // Rename the variable to avoid conflict
  const filteredProducts = products.filter(item => {
    // Check if the product's ID is in the productSalesCountMap
    return productSalesCountMap[item.id] > 5;
  });

  return (<>
          {
        filteredProducts.length===0? null: (
          <section className="trending_products">

          <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2 className="section_title mb-5">Trending Products</h2>
            </Col>
            {loading ? <h4>loading...</h4> : <ProductList data={filteredProducts} />}
          </Row>
        </Container>
            </section>

        )
      }
  </>
  );
}

export default Trendingproducts;
