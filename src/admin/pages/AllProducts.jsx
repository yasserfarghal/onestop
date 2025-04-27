import React from "react";
import useGetData from "../../custom_hooks/useGetData";
import Helmet from "../../components/helmet/Helmet";
import { motion } from "framer-motion";
import { Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import InformationLine from "remixicon-react/InformationLineIcon";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import { Link } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfigure";
import StarSFill from "remixicon-react/StarSFillIcon";
import { FallingLines } from 'react-loader-spinner';

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
      return 0; 
    }
    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    const averageRating = Math.floor(totalRating / feedbacks.length);
    return averageRating;
  };

  const [categoryFilter, setCategoryFilter] = React.useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = React.useState(null);
  const [priceFilter, setPriceFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");

  // Filter products based on selected category, subcategory, price range, and rating
  const filteredProducts = data
    ? data.filter((item) => {
        const isCategoryMatch = categoryFilter ? item.category === categoryFilter : true;
        const isSubcategoryMatch = categoryFilter === "clothes" ? item.subcategory === subcategoryFilter || subcategoryFilter === null 
          : categoryFilter === "electronics" ? item.subcategory === subcategoryFilter || subcategoryFilter === null
          : categoryFilter === "furniture" ? item.subcategory === subcategoryFilter || subcategoryFilter === null
          : categoryFilter === "watches" ? item.subcategory === subcategoryFilter || subcategoryFilter === null
          : true;
        const isPriceMatch = priceFilter === "all" 
          ? true 
          : priceFilter === "low" 
            ? item.price < 50 
            : priceFilter === "mid" 
              ? item.price >= 50 && item.price <= 200
              : item.price > 200;
        const isRatingMatch = ratingFilter === "all" 
          ? true 
          : calculateAverageRating(item.feedbacks) >= parseInt(ratingFilter);

        return isCategoryMatch && isSubcategoryMatch && isPriceMatch && isRatingMatch;
      })
    : [];

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [filteredProducts]);

  return (
    <Helmet title={`${categoryFilter ? categoryFilter : "All"} Products`}>
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">
                {categoryFilter || "All"} Products
              </h1>
            </Col>
          </Row>
        </Container>
      </section>

      <div className="mt-3 text-center filter_products-page">
        <Container>
          <Row>
            {/* Category Filter */}
            <Col>
              <DropdownButton 
                variant="primary" 
                title={categoryFilter || "Select Category"} 
                className="dropdown-toggle"
                onSelect={(eventKey) => {
                  setCategoryFilter(eventKey);
                  setSubcategoryFilter(null);  // Reset subcategory filter when category changes
                }}
              >
                <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                <Dropdown.Item eventKey="perfume">Perfume</Dropdown.Item>
                <Dropdown.Item eventKey="electronics">Electronics</Dropdown.Item>
                <Dropdown.Item eventKey="furniture">Furniture</Dropdown.Item>
                <Dropdown.Item eventKey="watches">Watches</Dropdown.Item>
                <Dropdown.Item eventKey="clothes">Clothes</Dropdown.Item>
                <Dropdown.Item eventKey="beauty">Beauty</Dropdown.Item>
              </DropdownButton>
            </Col>

            {/* Price Filter */}
            <Col>
              <DropdownButton 
                variant="primary" 
                title={priceFilter === "all" ? "Select Price Range" : priceFilter === "low" ? "Low Price" : priceFilter === "mid" ? "Mid Price" : "High Price"} 
                className="dropdown-toggle"
                onSelect={(eventKey) => setPriceFilter(eventKey)}
              >
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="low">Low Price</Dropdown.Item>
                <Dropdown.Item eventKey="mid">Mid Price</Dropdown.Item>
                <Dropdown.Item eventKey="high">High Price</Dropdown.Item>
              </DropdownButton>
            </Col>

            {/* Rating Filter */}
            <Col>
              <DropdownButton 
                variant="primary" 
                title={ratingFilter === "all" ? "Select Rating" : `${ratingFilter}+ Stars`} 
                className="dropdown-toggle"
                onSelect={(eventKey) => setRatingFilter(eventKey)}
              >
                <Dropdown.Item eventKey="all">All Ratings</Dropdown.Item>
                <Dropdown.Item eventKey="4">4+ Stars</Dropdown.Item>
                <Dropdown.Item eventKey="3">3+ Stars</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>

          {/* Subcategory Filter (Full Width) */}
          {categoryFilter && (
            <Row className="mt-3">
              <Col md={12}>
                <DropdownButton 
                  variant="primary" 
                  title={subcategoryFilter || "Select Subcategory"} 
                  className="dropdown-toggle w-100" 
                  onSelect={(eventKey) => setSubcategoryFilter(eventKey)}
                >
                  {categoryFilter === "clothes" && (
                    <>
                      <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                      <Dropdown.Item eventKey="men">Men's Clothes</Dropdown.Item>
                      <Dropdown.Item eventKey="women">Women's Clothes</Dropdown.Item>
                      <Dropdown.Item eventKey="babies">Babies</Dropdown.Item>
                      <Dropdown.Item eventKey="accessories">Accessories</Dropdown.Item>
                      <Dropdown.Item eventKey="shoes">Shoes</Dropdown.Item>
                    </>
                  )}
                  {categoryFilter === "electronics" && (
                    <>
                      <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                      <Dropdown.Item eventKey="mobile">Mobile Phones</Dropdown.Item>
                      <Dropdown.Item eventKey="laptop">Laptops</Dropdown.Item>
                      <Dropdown.Item eventKey="tablet">Tablets</Dropdown.Item>
                    </>
                  )}
                  {categoryFilter === "furniture" && (
                    <>
                      <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                      <Dropdown.Item eventKey="chairs">Chairs</Dropdown.Item>
                      <Dropdown.Item eventKey="tables">Tables</Dropdown.Item>
                      <Dropdown.Item eventKey="sofas">Sofas</Dropdown.Item>
                    </>
                  )}
                  {categoryFilter === "watches" && (
                    <>
                      <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                      <Dropdown.Item eventKey="men">Men's Watches</Dropdown.Item>
                      <Dropdown.Item eventKey="women">Women's Watches</Dropdown.Item>
                    </>
                  )}
                </DropdownButton>
              </Col>
            </Row>
          )}
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
                    {filteredProducts.length === 0 && !loading ? (
                      <tr>
                        <td colSpan="7">
                          <h5>There Are No Products.</h5>
                        </td>
                      </tr>
                    ) : filteredProducts && loading ? (
                      <tr>
                        <td colSpan="7">
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
                    ) : (
                      filteredProducts.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img src={item.img} alt="image product" />
                          </td>
                          <td>{item.name}</td>
                          <td className="fw-bold">${item.price}</td>
                          <td>{item.category}</td>
                          <td>{item.shortDesc}</td>
                          <td>
                            <p className="d-flex align-items-center text-muted">
                              ({calculateAverageRating(item.feedbacks)}) <StarSFill className="starIcon" />
                            </p>
                          </td>
                          <td>
                            <motion.span whileTap={{ scale: 1.2 }} className="pr-2">
                              <Link to={`/dashboard/All-Products/${item.id}`}>
                                <InformationLine className="Icon" />
                              </Link>
                            </motion.span>
                            <motion.span whileTap={{ scale: 1.2 }} className="pr-2" onClick={() => deleteDocument(item.id)}>
                              <DeleteBinLine className="Icon" />
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

export default AllProducts;
