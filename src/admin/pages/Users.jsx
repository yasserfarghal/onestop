import React from "react";
import useGetData from "../../custom_hooks/useGetData";
import { Container, Row, Col } from "react-bootstrap";
import Helmet from "../../components/helmet/Helmet";
import { motion } from "framer-motion";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfigure";
import { toast } from "react-toastify";
import Search2Line from "remixicon-react/Search2LineIcon";
import {FallingLines} from 'react-loader-spinner'


const Users = () => {
  const { data, loading } = useGetData("users");
  const { data: userOrder, loading: orderLoading } = useGetData("orders");
  const users = data.filter((item) => item.email !== "admin@gmail.com");

  const orders = (id) => {
    const ordersForUser = userOrder ? userOrder.filter((order) => order.userId === id) : [];
    const numOrders = ordersForUser.length;
    return numOrders === 0 ? 0 : numOrders;
  };

  const [searchedUser, setSearchedUser] = React.useState(null);

  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User Deleted Done");
    } catch (error) {
      toast.error("There Is Something Error");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const searchProducts = users.filter((item) =>
      item.Name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchedUser(searchProducts);
  };

  return (
    <Helmet title="Users">
      <section className="common_section text-center d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={12} sm={12}>
              <h1 className="title text-white">Users</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="shop pb-0 mt-0 pt-5">
        <Container>
          <Row>
            <Col>
              <div className="search_box">
                <input
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search By User Name..."
                />
                <span>
                  <Search2Line className="searchIcon" />
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="users_section">
        <Container>
          <Row>
            <Col md={12} lg={12}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Number of Orders</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && !loading ? (
                      <tr>
                        <td colSpan="5">
                          <h5>There Are No Users Found..</h5>
                        </td>
                      </tr>
                    ) : loading ? (
                      <tr>
                        <td colSpan="5">
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
                    ) : searchedUser === null ? (
                      users.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img src={item.img} alt="image product" />
                          </td>
                          <td>
                            <p>{item.Name}</p>
                          </td>
                          <td>
                            <p>{item.Email}</p>
                          </td>
                          <td>
                            <p>{orders(item.userId)}</p>
                          </td>
                          <td>
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
                    ) : searchedUser.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <h5>No Users Match Found..</h5>
                        </td>
                      </tr>
                    ) : (
                      searchedUser.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img src={item.img} alt="image product" />
                          </td>
                          <td>
                            <p>{item.Name}</p>
                          </td>
                          <td>
                            <p>{item.Email}</p>
                          </td>
                          <td>
                            <p>{orders(item.Email)}</p>
                          </td>
                          <td>
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

export default Users;
