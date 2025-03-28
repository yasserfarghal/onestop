import React from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebaseConfigure";
import Helmet from "../../components/helmet/Helmet";
import { Container, Row, Col, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import {toast} from 'react-toastify'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";




const ProductFullDetails = () => {

    const navigate = useNavigate()
  const { id } = useParams();
  const [data, setData] = React.useState({});

  const [product, setProduct] = React.useState({
    name: "",
    shortDesc: "",
    fullDesc: "",
    img: null,
    category: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle file input separately
    if (type === "file") {
      const file = e.target.files[0]; // Get the first selected file
      setProduct((prevState) => ({
        ...prevState,
        [name]: file, // Store the selected file object
      }));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
        toast.success("Product Deleted Done")
        navigate("/dashboard/All-Products")
    } catch (error) {
        toast.error("There Is Something Wrong")
    }
  };

  // ...
  
  const updateData = async (e) => {
    e.preventDefault();
  
    try {
      // Check if an image is selected for update
      if (product.img) {
        // Upload the new image to Firebase Storage
        const storageRef = ref(storage, `products/${product.img.name}`);
        const uploadImg = uploadBytesResumable(storageRef, product.img);
  
        // Wait for the image upload to complete and get the download URL
        const snapshot = await uploadImg;
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Update the document in the database with the new data including the new image URL
        await updateDoc(doc(db, "products", id), {
          name: product.name,
          shortDesc: product.shortDesc,
          fullDesc: product.fullDesc,
          img: downloadURL, // Store the download URL of the new image
          category: product.category,
          price: product.price,
        });
      } else {
        // If no image is selected for update, only update other fields
        await updateDoc(doc(db, "products", id), {
          name: product.name,
          shortDesc: product.shortDesc,
          fullDesc: product.fullDesc,
          category: product.category,
          price: product.price,
        });
      }
  
      toast.success("Product Updated Successfully");

      setProduct({
        name: "",
        shortDesc: "",
        fullDesc: "",
        img: null,
        category: "",
        price: "",
      })

      setTab("desc")
  
      // After updating, re-fetch the data to show the newest details
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message);
    }
  };
  
  

  const [tab, setTab] = React.useState("desc");



  React.useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setData(null);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Helmet title={`${data.name} Details`}>
      <section className="product_details-info">
        <Container>
          <h5 className="section_title">Product Details</h5>

          <Row>
            <Col md={6} lg={6}>
              <div className="product_img">
                <img src={data.img} alt="" />
              </div>
            </Col>

            <Col md={6} lg={6}>
              <div>
                <h4>
                  Title: <span> {data.name}</span>
                </h4>
                <h4>
                  Category: <span>{data.category}</span>
                </h4>
                <h4>
                  Short Desc.: <span>{data.shortDesc}</span>
                </h4>

                <h4>Price: <span>$ {data.price}</span></h4>
              </div>

              <div className="">
                <motion.button
                  whileTap={{ scale: 1.1 }}
                  className="buy_button mr-5 d-flex align-items-center justify-content-center"
                  onClick={()=>deleteDocument(id)}
                >
                  DELETE
                  <DeleteBinLine className="deleteIcon" />

                </motion.button>

              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="tab_section">
        <Container>
          <Row>
            <Col md={12} lg={12}>
              <div className="tab_wrapper d-flex align-items-center gap-5">
                <motion.h5
                  whileTap={{ scale: 1.1 }}
                  className={`pr-4 ${tab == "desc" ? "active_tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </motion.h5>
                <motion.h5
                  whileTap={{ scale: 1.1 }}
                  className={`pr-4 ${tab == "feed" ? "active_tab" : ""}`}
                  onClick={() => setTab("feed")}
                >
                  Update Details
                </motion.h5>

              </div>
              <div className="tab_content">
                {tab == "desc" ? (
                  <p className="product_desc">{data.fullDesc}</p>
                ) : tab == "feed" ? (
                    <Container>
                    <Row>
                      <Col>
          
                      <div className="update_product-form mt-4">
                      <div className="">
                          <h5 className="section_title">Product Details</h5>
                          <p className="text-muted">Update Your Product Details</p>
                        </div>
          
          
                          <form className="container mb-3">
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label className="fw-bold">Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  onChange={handleChange}
                                  value={product.name}
                                  className="form-control"
                                  placeholder="Please enter product name"
                                />
                              </Form.Group>
                            </Row>
          
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label className="fw-bold">Price</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="price"
                                  onChange={handleChange}
                                  value={product.price}
                                  className="form-control"
                                  placeholder="Please enter product price"
                                />
                              </Form.Group>
                            </Row>
          
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label className="fw-bold">Short Description</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="shortDesc"
                                  onChange={handleChange}
                                  value={product.shortDesc}
                                  className="form-control"
                                  placeholder="Lorem ipsum..."
                                />
                              </Form.Group>
                            </Row>
          
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label className="fw-bold">Description</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows="{3}"
                                  className="form-control"
                                  name="fullDesc"
                                  value={product.fullDesc}
                                  onChange={handleChange}
                                  placeholder="Lorem ipsum Lorem..."
                                />
                              </Form.Group>
                            </Row>
          
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label className="fw-bold">Category</Form.Label>
                                <Form.Select
                                  className="form-control"
                                  name="category"
                                  value={product.category}
                                  onChange={handleChange}
                                >
                                  <option>Choose...</option>
                                  <option value="chair">Chair</option>
                                  <option value="sofa">Sofa</option>
                                  <option value="bed">Bed</option>
                                </Form.Select>
                              </Form.Group>
                            </Row>
          
                            <Row className="mb-3">
                              <Form.Group controlId="formBasicEmail" className="col">
                                <Form.Label  className="fw-bold">Image</Form.Label>
                                <Form.Control
                                  type="file"
                                  name="img"
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </Form.Group>
                            </Row>
                            <motion.button
                              whileTap={{ scale: 1.1 }}
                              onClick={updateData}
                            >
                              UPDATE
                            </motion.button>
                          </form>
          
                      </div>
          
                      </Col>
                    </Row>
                  </Container>
                ) : null }
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductFullDetails;
