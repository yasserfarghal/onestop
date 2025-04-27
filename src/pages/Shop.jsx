import React from 'react';
import Helmet from '../components/helmet/Helmet';
import { Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import Search2Line from 'remixicon-react/Search2LineIcon';
import ProductList from '../components/ui/ProductList';
import useGetData from '../custom_hooks/useGetData';
import { FallingLines } from "react-loader-spinner";

const Shop = () => {
  const { data, loading } = useGetData('products');
  const [search, setSearch] = React.useState('');

  const [categoryFilter, setCategoryFilter] = React.useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = React.useState(null);
  const [priceFilter, setPriceFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");

  
  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return 0; // If there are no feedbacks, return 0 as the average rating
    }

    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    const averageRating = Math.floor(totalRating / feedbacks.length);
    return averageRating;
  };

  // ... Other code ...


  const handleFilterRating = (e) => {
    const filterValue = e.target.value;
    setRatingFilter(filterValue)
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    setCategoryFilter(filterValue);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  const filteredProducts = data
  ? data.filter((item) => {
      const isCategoryMatch = categoryFilter ? item.category === categoryFilter : true;
      const isSubcategoryMatch = subcategoryFilter 
      ? item.subCategory === subcategoryFilter 
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

        const isSearchMatch = (item.name || "").toLowerCase().includes(search.toLowerCase());

      return isCategoryMatch && isSubcategoryMatch && isPriceMatch && isRatingMatch && isSearchMatch;
    })
  : [];













  return (
    <Helmet title="shop">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Products</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="shop py-4">
  <Container>
    {/* Filters and Search Row */}
    <Row className="g-2 align-items-center">
      {/* Category Filter */}
      <Col xs={12} md={3}>
        <DropdownButton
          variant="secondary"
          title={categoryFilter || "Select Category"}
          className="w-100"
          onSelect={(eventKey) => {
            setCategoryFilter(eventKey);
            setSubcategoryFilter(null);
          }}
        >
          <Dropdown.Item eventKey={null}>All</Dropdown.Item>
          <Dropdown.Item eventKey="Perfume">Perfume</Dropdown.Item>
          <Dropdown.Item eventKey="Electronics">Electronics</Dropdown.Item>
          <Dropdown.Item eventKey="Furniture">Furniture</Dropdown.Item>
          <Dropdown.Item eventKey="Watches">Watches</Dropdown.Item>
          <Dropdown.Item eventKey="Clothes">Clothes</Dropdown.Item>
          <Dropdown.Item eventKey="Beauty">Beauty</Dropdown.Item>
        </DropdownButton>
      </Col>

      {/* Price Filter */}
      <Col xs={12} md={2}>
        <DropdownButton
          variant="secondary"
          title={
            priceFilter === "all"
              ? "Price Range"
              : priceFilter === "low"
              ? "Low"
              : priceFilter === "mid"
              ? "Mid"
              : "High"
          }
          className="w-100"
          onSelect={(eventKey) => setPriceFilter(eventKey)}
        >
          <Dropdown.Item eventKey="all">All</Dropdown.Item>
          <Dropdown.Item eventKey="low">Low</Dropdown.Item>
          <Dropdown.Item eventKey="mid">Mid</Dropdown.Item>
          <Dropdown.Item eventKey="high">High</Dropdown.Item>
        </DropdownButton>
      </Col>

      {/* Rating Filter */}
      <Col xs={12} md={2}>
        <DropdownButton
          variant="secondary"
          title={
            ratingFilter === "all" ? "Rating" : `${ratingFilter}+ Stars`
          }
          className="w-100"
          onSelect={(eventKey) => setRatingFilter(eventKey)}
        >
          <Dropdown.Item eventKey="all">All Ratings</Dropdown.Item>
          <Dropdown.Item eventKey="5">5+ Stars</Dropdown.Item>
          <Dropdown.Item eventKey="4">4+ Stars</Dropdown.Item>
          <Dropdown.Item eventKey="3">3+ Stars</Dropdown.Item>
          <Dropdown.Item eventKey="2">2+ Stars</Dropdown.Item>
          <Dropdown.Item eventKey="1">1+ Stars</Dropdown.Item>
        </DropdownButton>
      </Col>

      {/* Search Box */}
      <Col xs={12} md={5}>
        <div className="search_box d-flex align-items-center w-100">
          <input
            onChange={handleSearch}
            value={search}
            type="text"
            placeholder="Search For..?"
            className="form-control me-2"
          />
          <span><Search2Line className="searchIcon" /></span>
        </div>
      </Col>
    </Row>

    {/* Subcategory Filter */}
    {categoryFilter && (
      <Row className="mt-3">
        <Col md={12}>
          <DropdownButton
            variant="info"
            title={subcategoryFilter || "Select Subcategory"}
            className="w-100"
            onSelect={(eventKey) => setSubcategoryFilter(eventKey)}
          >
            {/* ... Subcategory logic as before ... */}
            {categoryFilter === "Clothes" && (
              <>
                <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                <Dropdown.Item eventKey="Men">Men's Clothes</Dropdown.Item>
                <Dropdown.Item eventKey="Women">Women's Clothes</Dropdown.Item>
                <Dropdown.Item eventKey="Babies">Babies</Dropdown.Item>
                <Dropdown.Item eventKey="Accessories">Accessories</Dropdown.Item>
                <Dropdown.Item eventKey="Shoes">Shoes</Dropdown.Item>
              </>
            )}
                        {categoryFilter === "Electronics" && (
              <>
                <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                <Dropdown.Item eventKey="Phones">Phones</Dropdown.Item>
                <Dropdown.Item eventKey="Laptops">Laptops</Dropdown.Item>
                <Dropdown.Item eventKey="Accessories">Accessories</Dropdown.Item>
              </>
            )}
            {categoryFilter === "Furniture" && (
                          <>
                            <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                            <Dropdown.Item eventKey="Tables">Tables</Dropdown.Item>
                            <Dropdown.Item eventKey="Chairs">Chairs</Dropdown.Item>
                            <Dropdown.Item eventKey="Beds">Beds</Dropdown.Item>
                          </>
                        )}

{categoryFilter === "Watches" && (
                          <>
                            <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                            <Dropdown.Item eventKey="Luxury">Luxury</Dropdown.Item>
                            <Dropdown.Item eventKey="Casual">Casual</Dropdown.Item>
                            <Dropdown.Item eventKey="Sport">Sport</Dropdown.Item>
                          </>
                        )}

{categoryFilter === "Beauty" && (
                          <>
                            <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                            <Dropdown.Item eventKey="Luxury">Skincare</Dropdown.Item>
                            <Dropdown.Item eventKey="Makeup">Makeup</Dropdown.Item>
                            <Dropdown.Item eventKey="Hair">Hair</Dropdown.Item>
                          </>
                        )}


{categoryFilter === "Perfume" && (
                          <>
                            <Dropdown.Item eventKey={null}>All</Dropdown.Item>
                            <Dropdown.Item eventKey="Men">Men</Dropdown.Item>
                            <Dropdown.Item eventKey="Women">Women</Dropdown.Item>
                            <Dropdown.Item eventKey="Unisex">Unisex</Dropdown.Item>
                          </>
                        )}




                        
          </DropdownButton>
        </Col>
      </Row>
    )}
  </Container>
</section>



      <section className="shop_products">
        <Container>
          <Row>
            {!loading&&filteredProducts.length === 0 ? (
              <h3>There Is No Products</h3>
            ) : loading?(
              <>
              <FallingLines
  color="rgb(138, 61, 93)"
  width="50"
  visible={true}
  ariaLabel="falling-lines-loading"
/>;
              </>
            ):((
              <ProductList data={filteredProducts} />
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
