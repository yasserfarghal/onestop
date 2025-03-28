import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Helmet from "../../components/helmet/Helmet";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { db, storage } from "../../firebaseConfigure";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ProgressBar } from "react-loader-spinner";
import ImageAddLine from "remixicon-react/ImageAddLineIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: "",
    shortDesc: "",
    fullDesc: "",
    images: [],
    category: "",
    price: "", // EGP Price
    prices: { egp: "", usd: "", sar: "" }, // Object to store all currencies
  });
  

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const exchangeRates = {
  usd: 0.032, // 1 EGP = 0.032 USD (example rate)
  sar: 0.12,  // 1 EGP = 0.12 SAR (example rate)
};

const handleChange = (e) => {
  const { name, value, type, files } = e.target;
  
  if (name === "price") {
    const priceEGP = parseFloat(value) || 0; // Ensure numeric input
    setProduct((prevState) => ({
      ...prevState,
      price: value,
      prices: {
        egp: priceEGP,
        usd: (priceEGP * exchangeRates.usd).toFixed(2),
        sar: (priceEGP * exchangeRates.sar).toFixed(2),
      },
    }));
  } else if (type === "file" && files.length > 0) {
    const selectedFiles = Array.from(files);
    setProduct((prevState) => ({
      ...prevState,
      images: selectedFiles,
    }));
    const imagePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  } else {
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};


  const uploadImagesToFirebase = async (files) => {
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `products/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        return await getDownloadURL(uploadTask.snapshot.ref);
      })
    );
    return imageUrls;
  };

  const handleSubmitter = async (e) => {
    e.preventDefault();
  
    if (!product.name || !product.shortDesc || !product.fullDesc || product.images.length === 0 || !product.category || !product.price) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    try {
      setLoading(true);
      const docRef = collection(db, "products");
      const imageUrls = await uploadImagesToFirebase(product.images);
  
      await addDoc(docRef, {
        name: product.name,
        shortDesc: product.shortDesc,
        fullDesc: product.fullDesc,
        images: imageUrls,
        category: product.category,
        price: product.price,
        prices: product.prices, // Store multiple currency prices
        feedbacks: [{ userName: "", rate: null, feed: "" }],
      });
  
      setProduct({
        name: "",
        shortDesc: "",
        fullDesc: "",
        images: [],
        category: "",
        price: "",
        prices: { egp: "", usd: "", sar: "" },
      });
  
      setPreviewImages([]);
      setLoading(false);
      navigate("/dashboard/All-Products");
      toast.success("Product Added Successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error Adding Product.");
    }
  };
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loading]);

  return (
    <Helmet title="Add-Products">
      <section className="add_product-page mt-0 pt-0">
        <Container>
          <Row>
            <Col>
              <div className="add_product-form">
                <div className="text-center">
                  <h5 className="section_title">Add Product</h5>
                  <p>Add Your New Product To The Store</p>
                </div>

                {loading ? (
                  <div className="text_center d-flex align-items-center justify-content-center">
                    <ProgressBar
                      height="60"
                      width="60"
                      ariaLabel="progress-bar-loading"
                      wrapperStyle={{}}
                      wrapperClass="progress-bar-wrapper"
                      borderColor="rgb(138, 61, 93)"
                      barColor="#51E5FF"
                    />
                    <h6 className="text-muted mt-1 ml-2 pt-1">
                      Please Wait Processing..
                    </h6>
                  </div>
                ) : (
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
                    <Form.Group controlId="formBasicPrice" className="col">
                      <Form.Label className="fw-bold">Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        onChange={handleChange}
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")}
                        value={product.price}
                        className="form-control"
                        placeholder="Please enter product price"
                        min="0"
                      />
                    </Form.Group>
                    </Row>

                    <Row className="mb-3">
                      <Form.Group controlId="formBasicShortDesc" className="col">
                        <Form.Label className="fw-bold">
                          Short Description
                        </Form.Label>
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
                      <Form.Group controlId="formBasicDesc" className="col">
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
                      <Form.Group controlId="formBasicCategory" className="col">
                        <Form.Label className="fw-bold">Category</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-control"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                          >
                            <option value="">Select a Category</option>
                            <option value="sofa">Sofas</option>
                            <option value="chair">Chairs</option>
                            <option value="bed">Beds</option>
                          </Form.Control>
                      </Form.Group>
                    </Row>


                    <Row className="mb-3">
                      <Form.Group className="col">
                        <Form.Label className="fw-bold">Images</Form.Label>
                        <div className="custom-file-upload">
                          <label htmlFor="file-upload" className="custom-button">
                            <ImageAddLine className="icon" />
                            <span className="ml-2">{product.images.length > 0 ? `${product.images.length} files selected` : "Choose Files"}</span>
                          </label>
                          <Form.Control id="file-upload" type="file" multiple name="images" onChange={handleChange} className="file-input" />
                        </div>
                        {previewImages.length > 0 && (
                          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={10} slidesPerView={1} className="image-preview-swiper">
                            {previewImages.map((img, index) => (
                              <SwiperSlide key={index}>
                                <img src={img} alt={`Preview ${index + 1}`} className="preview-image" />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        )}
                      </Form.Group>
                    </Row>




                    <motion.button
                      onClick={handleSubmitter}
                      whileTap={{ scale: 1.1 }}
                    >
                      ADD PRODUCT
                    </motion.button>
                  </form>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AddProducts;