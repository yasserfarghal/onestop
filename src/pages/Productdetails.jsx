import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/helmet/Helmet";
import StarSFill from "remixicon-react/StarSFillIcon";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { cartAction } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import ProductList from "../components/ui/ProductList";
import Heart2Fill from "remixicon-react/Heart2FillIcon";
import { favActions } from "../redux/slices/favSlice";
import useGetData from "../custom_hooks/useGetData";
import { doc, updateDoc, setDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfigure";
import useAuth from "../custom_hooks/useAuth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";



const Productdetails = () => {

  const navigate = useNavigate()

  const user = useAuth().currentUser

  const { id } = useParams(); // Extract the ID from the object returned by useParams()

  const { data, loading } = useGetData("products");

  const favs = useSelector((state) => state.fav.favItems);

  const productData = data ? data.find((item) => item.id == id) : null;

  const relatedProducts = data
    ? data.filter((item) => item.category == productData.category && item.id !== productData.id)
    : data;

  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(
      cartAction.addItem({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        img: productData.img,
      })
    );
    toast.success("product have done add");
  };

  const addToFav = async () => {
    if (!user) {
      toast.error("You must login first!");
      navigate("/login");
      return;
    }
  
    const productDocRef = doc(db, "products", productData.id);
  
    try {
      const docSnap = await getDoc(productDocRef);
  
      if (!docSnap.exists()) {
        toast.error("Product not found");
        return;
      }
  
      const product = docSnap.data();
      const likedBy = product.likedBy || [];
  
      const isLiked = likedBy.includes(user.uid);
  
      if (isLiked) {
        // Remove user ID from likedBy
        await updateDoc(productDocRef, {
          lovedBy: arrayRemove(user.uid),
        });
  
        dispatch(favActions.remFav({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          img: productData.img,
          desc: productData.desc,
        }));
  
        setfave("active");
        toast.success("Removed from favorites");
      } else {
        // Add user ID to likedBy
        await updateDoc(productDocRef, {
          lovedBy: arrayUnion(user.uid),
        });
  
        dispatch(favActions.addFav({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          img: productData.img,
          desc: productData.desc,
        }));
  
        setfave("disactive");
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating likedBy array:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (productData && user) {
      const isLiked = productData.likedBy?.includes(user.uid);
      setfave(isLiked ? "disactive" : "active");
    }
  }, [productData, user]);
  
  

  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return 0;
    }
  
    // حساب مجموع التقييمات
    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    // حساب المتوسط بدقة مع التقريب لأقرب عدد صحيح
    const averageRating = Math.round(totalRating / feedbacks.length); 
  
    return averageRating;
  };

  function RatingComponent({ rating }) {
    const stars = [];
  
    for (let i = 0; i < rating; i++) {
      stars.push(<StarSFill key={i} className="starIcon" />);
    }
  
    return <div>{stars}</div>;
  }

  function Reviews() {
    return (
      <div className="product_review">
        <div className="review_wrapper">
          <ul>
            {productData.feedbacks.length == 1 ? (
              <h4 className="mt-4">There Is No Reviews</h4>
            ) : (
              productData.feedbacks
                .filter((item) => item.userName !== "" && item.rate !== null && item.feed !== "")
                .map((item, index) => (
                  <li key={index}>
                    <h6 className="mb-1">
                      <span className="fw-bold">User:</span> {item.userName}
                    </h6>
                    <span>
                      <span className="fw-bold">Rate: </span>({item.rate})
                    </span>
                    <p className="mt-1">
                      <span className="fw-bold">Review: </span> {item.feed}
                    </p>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    );
  }
  
  

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setTab("desc");
  }, [id, data]);

  const [feed, setFeed] = useState({
    userName: "",
    rate: 0,
    feedback: "",
  });

  const [fave, setfave] = useState("active");


  const handleSubmiter = async (e) => {
    e.preventDefault();
    if (feed.userName === "" || feed.rate === 0 || feed.feedback === "") {
      toast.error("Please Enter Your Data & Review");
    }else if(!user){
      toast.error("Must Login First.!")
      navigate("/login")
    }
    else {
      try {
        if (
          !productData ||
          !productData.feedbacks ||
          !Array.isArray(productData.feedbacks)
        ) {
          // Handle the case where productData or feedbacks array is not available
          throw new Error("Product data or feedbacks array not available");
        }

        console.log("Before updating feedbacks array:", productData.feedbacks);

        // Make a shallow copy of the feedbacks array
        const updatedFeedbacks = [...productData.feedbacks];

        // Use arrayUnion to add the new feedback to the existing array
        updatedFeedbacks.push({
          userName: feed.userName,
          rate: feed.rate,
          feed: feed.feedback,
        });

        // Update the document with the updated feedbacks array
        await updateDoc(doc(db, "products", id), {
          feedbacks: updatedFeedbacks,
        });

        console.log("After updating feedbacks array:", updatedFeedbacks);

        setFeed({
          userName: "",
          rate: 0,
          feedback: "",
        });
        toast.success("Review Has Been Sent");
        setTab("desc");
      } catch (error) {
        console.error("Error updating feedback:", error);
        toast.error(error);
      }
    }
  };

  const [tab, setTab] = React.useState("desc");

  return (
    <Helmet title="details">
      {data && loading ? (
        <h1>Loading...</h1>
      ) : productData ? (
        <>
<section className="product_details-info">
  <Container>
    <Row>
      <Col md={6} lg={6}>
        <div className="product_img">
          <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            {productData.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`product-${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Col>

      <Col md={6} lg={6}>
        <div>
          <h2 className="product_name">{productData.name}</h2>
          <h2 className="product_name">{productData.category},{productData.subCategory}</h2>
          <div className="product_details">
            <div className="product_rating-feedbac mb-0 d-flex align-items-center">
              <RatingComponent />
              <p className="pt-2 pl-2 text-muted">
                ({productData.feedbacks.length === 1 ? 0 : productData.feedbacks.length - 1} Reviews)
              </p>
            </div>
            <span>Price: $ {productData.price}</span>
            <p className="small_desc">{productData.shortDesc}</p>
            {user && user.email !== "admin@gmail.com" || !user ? (
              <>
                <div className="d-flex align-items-center">
                  <motion.button whileTap={{ scale: 1.1 }} onClick={addToCart} className="buy_button mr-5">
                    ADD TO CART
                  </motion.button>

                  <motion.button whileTap={{ scale: 1.1 }} onClick={addToFav} className="fav_button">
  <Heart2Fill className={fave === "active" ? "favIcon" : "disactive-fav"} />
</motion.button>

                </div>
              </>
            ) : null}
          </div>
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
                      className={`pr-4 ${
                        tab == "feed" ? "active_tab" : ""
                      }`}
                      onClick={() => setTab("feed")}
                    >
                      Reviews (
                      {productData.feedbacks.length == 1
                        ? 0
                        : productData.feedbacks.length - 1}
                      )
                    </motion.h5>
                    {user && user.email !== "admin@gmail.com" || !user ?                     <motion.h5
                      whileTap={{ scale: 1.1 }}
                      className={tab == "review" ? "active_tab" : ""}
                      onClick={() => setTab("review")}
                    >
                      Rate
                    </motion.h5> : null  }
                  </div>
                  <div className="tab_content">
                    {tab == "desc" ? (
                      <p className="product_desc">{productData.fullDesc}</p>
                    ) : tab == "feed" ? (
                      <Reviews />
                    ) : (
                      <div className="product_review-form mt-3">
                        <div className="review_wrapper-form">
                          <div className="form_group d-flex align-items-center ">
                            <span className="fw-bold">Name:</span>

                            <input
                              onChange={(e) =>
                                setFeed((item) => ({
                                  ...item,
                                  userName: e.target.value,
                                }))
                              }
                              id="userName"
                              type="text"
                              placeholder="Enter Name"
                              value={feed.userName}
                              className="input_field mt-3"
                            />
                          </div>

                          <div className="form_group d-flex mt-4 mb-3 justify-content-between ">
                            <span className="fw-bold pr-4">Rate :</span>

                            <motion.div
                              className={`pr-3 ${
                                feed.rate >= 1 ? "active_star" : ""
                              }`}
                              onClick={() =>
                                setFeed((item) => ({
                                  ...item,
                                  rate: item.rate == 1 ? 0 : 1,
                                }))
                              }
                              whileTap={{ scale: 0.5 }}
                            >
                              <StarSFill className="starIcon" />
                            </motion.div>
                            <motion.div
                              className={`pr-3 ${
                                feed.rate >= 2 ? "active_star" : ""
                              }`}
                              onClick={() => setFeed((item) => ({ ...item, rate: 2 }))}
                              whileTap={{ scale: 0.5 }}
                            >
                              <StarSFill className="starIcon" />
                            </motion.div>
                            <motion.div
                              className={`pr-3 ${
                                feed.rate >= 3 ? "active_star" : ""
                              }`}
                              onClick={() => setFeed((item) => ({ ...item, rate: 3 }))}
                              whileTap={{ scale: 0.5 }}
                            >
                              <StarSFill className="starIcon" />
                            </motion.div>
                            <motion.div
                              className={`pr-3 ${
                                feed.rate >= 4 ? "active_star" : ""
                              }`}
                              onClick={() => setFeed((item) => ({ ...item, rate: 4 }))}
                              whileTap={{ scale: 0.5 }}
                            >
                              <StarSFill className="starIcon" />
                            </motion.div>
                            <motion.div
                              className={`pr-3 ${
                                feed.rate >= 5 ? "active_star" : ""
                              }`}
                              onClick={() => setFeed((item) => ({ ...item, rate: 5 }))}
                              whileTap={{ scale: 0.5 }}
                            >
                              <StarSFill className="starIcon" />
                            </motion.div>
                            <span className="pl-2 fw-bold text-muted ">
                              ({feed.rate})
                            </span>
                          </div>

                          <div className="form_group d-flex -align-items-center">
                            <span className="fw-bold">Review:</span>
                            <textarea
                              onChange={(e) =>
                                setFeed((item) => ({
                                  ...item,
                                  feedback: e.target.value,
                                }))
                              }
                              value={feed.feedback}
                              id="feed"
                              type="text"
                              placeholder="Enter Your Review"
                              className="input_field mt-2"
                            />
                          </div>

                          <motion.button
                            whileTap={{ scale: 1.1 }}
                            className="send_review"
                            onClick={handleSubmiter}
                          >
                            SEND
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="related_products">
            <Container>
              <h3 className="related_items">Related Items</h3>

              <Row>
                <ProductList data={relatedProducts} />
              </Row>
            </Container>
          </section>
        </>
      ) : null}
    </Helmet>
  );
};

export default Productdetails;
