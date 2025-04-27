import React ,{useState} from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebaseConfigure";
import Helmet from "../../components/helmet/Helmet";
import { Container, Row, Col, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import {toast} from 'react-toastify'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
import ImageAddLine from "remixicon-react/ImageAddLineIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";





const ProductFullDetails = () => {

    const navigate = useNavigate()
  const { id } = useParams();
  const [data, setData] = React.useState({});

  const [product, setProduct] = useState({
    name: "",
    shortDesc: "",
    fullDesc: "",
    images: [],
    category: "",
    price: "", // EGP Price
    prices: { egp: "", usd: "", sar: "" }, // Object to store all currencies
  });

  const [subCategory, setSubCategory] = useState("");

  const subCategoryOptions = {
    Perfume: ["Men", "Women", "Unisex"],
    Electronics: ["Phones", "Laptops", "Accessories"],
    Furniture: ["Tables", "Chairs", "Beds"],
    Watches: ["Luxury", "Casual", "Sport"],
    Clothes: ["Men", "Women", "Kids"],
    Beauty: ["Skincare", "Makeup", "Hair"],
  };

  const [previewImages, setPreviewImages] = useState([]);


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
  
  const updateData = async (e) => {
    e.preventDefault();
  

  
    try {
      // Check if an image is selected for update
      if (product.img) {
        // Upload the new image to Firebase Storage
      const imageUrls = await uploadImagesToFirebase(product.images);
      const coverImage = imageUrls[0]; // أول صورة
  
        // Update the document in the database with the new data including the new image URL
        await updateDoc(doc(db, "products", id), {
          name: product.name,
          shortDesc: product.shortDesc,
          fullDesc: product.fullDesc,
          images: imageUrls,
          img: coverImage,
          category: product.category,
          subCategory, // ✅ أضف هذا السطر
          price: product.price,
          prices: product.prices,
          feedbacks: [{ userName: "", rate: null, feed: "" }],
          lovedBy: [],
        });
      } else {
        // If no image is selected for update, only update other fields
        await updateDoc(doc(db, "products", id), {
          name: product.name,
          shortDesc: product.shortDesc,
          fullDesc: product.fullDesc,
          category: product.category,
          subCategory, // ✅ أضف هذا السطر
          price: product.price,
          prices: product.prices,
          feedbacks: [{ userName: "", rate: null, feed: "" }],
          lovedBy: [],
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
                  Category: <span>{data.category}</span>, <span>{data.subCategory}</span>
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
                            <option value="Perfume">Perfume</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Watches">Watches</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Beauty">Beauty</option>


                          </Form.Control>
                      </Form.Group>
                    </Row>

                    {product.category && subCategoryOptions[product.category] && (
  <Row className="mb-3">
    <Form.Group controlId="formSubCategory" className="col">
      <Form.Label className="fw-bold">Subcategory</Form.Label>
      <Form.Control
        as="select"
        className="form-control"
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
      >
        <option value="">Select a Subcategory</option>
        {subCategoryOptions[product.category].map((sub, idx) => (
          <option key={idx} value={sub}>
            {sub}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  </Row>
)}



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
                      onClick={updateData}
                      whileTap={{ scale: 1.1 }}
                    >
                      ADD PRODUCT
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
