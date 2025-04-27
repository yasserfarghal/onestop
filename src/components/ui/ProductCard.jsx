import React from "react";
import { Col } from "react-bootstrap";
import AddFill from "remixicon-react/AddFillIcon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {useDispatch} from 'react-redux'
import {cartAction} from '../../redux/slices/cartSlice'
import {toast} from 'react-toastify'
import useAuth from "../../custom_hooks/useAuth";
import StarSFill from "remixicon-react/StarSFillIcon";


function ProductCard(props) {

  const user = useAuth().currentUser

  const { data } = props;


  const dispatch = useDispatch();

  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return 0; // If there are no feedbacks, return 0 as the average rating
    }

    const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rate, 0);
    const averageRating = Math.floor(totalRating / feedbacks.length);
    return averageRating;
  };

  const addToCart = () => {
    dispatch(cartAction.addItem({
      id: data.id,
      name: data.name,
      price: data.price,
      img: data.img
    }))
    toast.success("product have done add")
  }
  return (
    <Col key={data.id} md={3} lg={3} sm={3}>
      <motion.div whileHover={{ scale: 1.05 }} className="product_item">
        <div className="product_img">
          <motion.img
            whileHover={{ scale: 0.9 }}
            src={data.img}
            alt="Product_image"
            className="productImg"
          />
        </div>
        <div className="p-2 product_details">
        <div className=" product_info">
          <h3 className="product_name d-flex align-items-center justify-content-between">
          <Link to={`/shop/${data.id}`} title={data.name}>
  {data.name.length > 12 ? data.name.slice(0, 12) + "..." : data.name}
</Link>
            <span className="d-flex align-items-center"><StarSFill className="starIcon"/> ({calculateAverageRating(data.feedbacks)})</span>
          </h3>
          <span className="text-center">{data.category}</span>
        </div>
        <div className="product_card-bottom d-flex align-items-center justify-content-between">
          <span className="price pl-2">${data.price}</span>
          {user && user.email !== "admin@gmail.com" || !user ?           <motion.span whileTap={{ scale: 1.2 }} className="pr-2" onClick={addToCart}>
            <AddFill className="addToCartIcon" />
          </motion.span> : null}
        </div>
        </div>
      </motion.div>
    </Col>
  );
}

export default ProductCard;