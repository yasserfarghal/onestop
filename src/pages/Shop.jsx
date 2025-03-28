import React from 'react';
import Helmet from '../components/helmet/Helmet';
import { Container, Row, Col } from 'react-bootstrap';
import Search2Line from 'remixicon-react/Search2LineIcon';
import ProductList from '../components/ui/ProductList';
import useGetData from '../custom_hooks/useGetData';
import { FallingLines } from "react-loader-spinner";

const Shop = () => {
  const { data, loading } = useGetData('products');
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [filterRating, setFilterRating] = React.useState('all');

  
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
      setFilterRating(filterValue)
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  const filteredProducts = data
    .filter((item) =>
      (filter === 'all' || item.category === filter) &&
      item.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      const averageRating = calculateAverageRating(item.feedbacks);
      if (filterRating === 'highToLow') {
        return averageRating >= 0 && averageRating <= 5;
      } else if (filterRating === 'lowToHigh') {
        return averageRating >= 0 && averageRating <= 5;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      const averageRatingA = calculateAverageRating(a.feedbacks);
      const averageRatingB = calculateAverageRating(b.feedbacks);

      if (filterRating === 'highToLow') {
        return averageRatingB - averageRatingA;
      } else if (filterRating === 'lowToHigh') {
        return averageRatingA - averageRatingB;
      } else {
        return 0; // No sorting if rating filter is 'all'
      }
    });





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

      <section className="shop">
        <Container>
          <Row>
            <Col>
              <div className="filter_widget">
                <label htmlFor="filter" className="pr-2">
                  Filter By Category
                </label>
                <select id="filter" value={filter} onChange={handleFilter}>
                  <option value="all">All</option>
                  <option value="sofa">Sofas</option>
                  <option value="chair">Chairs</option>
                  <option value="bed">Beds</option>
                </select>
              </div>
            </Col>

            <Col>
              <div className="filter_widget">
                <label htmlFor="filter" className="pr-2">
                  Filter By Rating
                </label>
                <select id="filter" value={filterRating} onChange={handleFilterRating}>
                  <option value="all">All</option>
                  <option value="lowToHigh">Low To High</option>
                  <option value="highToLow">High To Low</option>
                </select>
              </div>
            </Col>

            <Col>
              <div className="search_box">
                <input
                  onChange={handleSearch}
                  value={search}
                  type="text"
                  placeholder="Search For..?"
                />
                <span><Search2Line className='searchIcon'/></span>
              </div>
            </Col>
          </Row>
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
