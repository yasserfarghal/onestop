import React, { useRef, useState } from "react";
  import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
  import Helmet from "../components/helmet/Helmet";
  import useAuth from "../custom_hooks/useAuth";
  import { FallingLines } from "react-loader-spinner";
  import userImg from "../assets/149071.png";
  import useGetData from "../custom_hooks/useGetData";
  import { motion } from "framer-motion";
  import InformationLine from "remixicon-react/InformationLineIcon";
  import DeleteBinLine from "remixicon-react/DeleteBinLineIcon";
  import { Link } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { updateDoc, doc, query, where, getDocs, collection, deleteDoc } from "firebase/firestore";
  import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
  import { db, storage } from "../firebaseConfigure";
  import { toast } from "react-toastify";
  import { updateEmail, updatePassword, updateProfile, getAuth, EmailAuthProvider, reauthenticateWithCredential,deleteUser } from "firebase/auth";


  const Profile = () => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const authUser = useAuth().currentUser;
    const { data: users, loading: usersLoading } = useGetData("users");
    const { data: orders, loading: ordersLoading } = useGetData("orders");
    const { data: products, loading: productsLoading } = useGetData("products");

    const [userOrders, setuserOrders] = React.useState(null);
    const reduxUser = useSelector((state) => state.auth.currentUser);

    console.log(reduxUser);

    const ordersCount = orders?.filter(order => order.userId === currentUser?.uid)?.length || 0;

  const completedOrdersCount = orders?.filter(
    order => order.userId === currentUser?.uid && order.state === "complete"
  )?.length || 0;

  const favProductsCount = products?.filter(
    product => product.likedBy?.includes(currentUser?.uid)
  )?.length || 0;


    const firebaseUsers =
      users && !usersLoading && users.find((item) => item.userId === authUser.uid)
        ? true
        : null;

    const ordersUser =
      orders &&
      !ordersLoading &&
      orders.filter(
        (item) => item.userId === currentUser.uid || currentUser.userId
      )
        ? true
        : null;

    React.useEffect(() => {
      if (firebaseUsers !== null) {
        setCurrentUser(firebaseUsers);
      } else if (firebaseUsers === null) {
        setCurrentUser(authUser);
      }
    }, [authUser]);

    const getProviderDisplayName = (providerId) => {
      switch (providerId) {
        case "google.com":
          return "Google";
        // Add more cases for other providers if needed
        default:
          return "Unknown";
      }
    };

    const [tab, setTab] = React.useState("orders");

    const fileInputRef = useRef();

    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file || !currentUser) return;
    
      try {
        const storageRef = ref(storage, `images/${currentUser.email || currentUser.displayName}`);
        const uploadImg = uploadBytesResumable(storageRef, file);
        await uploadImg;
        const downloadURL = await getDownloadURL(uploadImg.snapshot.ref);
    
        // ابحث عن وثيقة المستخدم
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const docToUpdate = querySnapshot.docs[0];
          await updateDoc(docToUpdate.ref, {
            img: downloadURL,
          });
    
          // تحديث Firebase Auth
          const auth = getAuth();
          await updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          });
    
          // تحديث الحالة في الواجهة
          setCurrentUser((prev) => ({
            ...prev,
            img: downloadURL,
            photoURL: downloadURL
          }));
    
          toast.success("Profile image updated successfully");
        } else {
          toast.error("User document not found in Firestore");
        }
      } catch (err) {
        console.error("Error updating image:", err);
        toast.error("Something went wrong while updating the profile image.");
      }
    };


    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", img: null });

    const handleUpdate = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
    
      try {
        // 1. تحميل الصورة إذا تم اختيارها
        let downloadURL = currentUser.photoURL || currentUser.img;
        if (formData.img) {
          const storageRef = ref(storage, `images/${formData.name}`);
          const uploadTask = uploadBytesResumable(storageRef, formData.img);
          await uploadTask;
          downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        }
    
        // 2. تحديث الاسم والصورة في Auth
        await updateProfile(user, {
          displayName: formData.name,
          photoURL: downloadURL,
        });
    
        // 3. تحديث البريد وكلمة السر بعد إعادة التوثيق
        if (formData.email && formData.email !== user.email) {
          const credential = EmailAuthProvider.credential(user.email, formData.passwordForUpdate);
          await reauthenticateWithCredential(user, credential);
          await updateEmail(user, formData.email);
        }
    
        if (formData.password) {
          await updatePassword(user, formData.password);
        }
    
        // 4. تحديث البيانات في Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref;
          await updateDoc(userDocRef, {
            Name: formData.name,
            Email: formData.email || user.email,
            Password: formData.password || "",
            img: downloadURL,
          });
        }
    
        toast.success("Account updated successfully");
        setShowModal(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update account");
      }
    };
  
    const handleDeleteAccount = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          await deleteDoc(querySnapshot.docs[0].ref);
        }
  
        await deleteUser(user);
        toast.success("Account deleted successfully");
        setShowModal(false);
        // Redirect or cleanup logic here
      } catch (err) {
        toast.error("Failed to delete account");
      }
    };
    
    

    return (
      <Helmet title="Profile">
        <section className="user_profile-details pt-0 pb-4">
          <Container className="user_container">
            <h3 className="text-center pb-3 mt-5">
              <span> Profile </span>
            </h3>
            <Row>
              <Col lg={2} sm={12} md={2}>
                <div className="user_img">
                  {currentUser &&
                  currentUser.photoURL !== null &&
                  currentUser.img !== null ? (
                    <img src={currentUser.photoURL} alt="User Profile1" />
                  ) : currentUser &&
                    currentUser.photoURL === null &&
                    currentUser.img !== null ? (
                    <img src={currentUser.img} alt="User Profile2" />
                  ) : currentUser &&
                    usersLoading &&
                    currentUser.photoURL === null &&
                    currentUser.img === null ? (
                    <FallingLines
                      color="rgb(138, 61, 93)"
                      width="50"
                      visible={true}
                      ariaLabel="falling-lines-loading"
                    />
                  ) : (
                    <img src={userImg} alt="Default User Profile" />
                  )}
                </div>
              </Col>
              <Col lg={10} sm={12} md={10} className="d-flex align-items-center">
                <div className="user_data pt-4">
                  <p>
                    <span className="fw-bold">Name: </span>
                    {currentUser &&
                    (currentUser.displayName !== null ||
                      currentUser.Name !== null ||
                      (reduxUser && reduxUser.displayName !== null)) ? (
                      currentUser.displayName ||
                      currentUser.Name ||
                      reduxUser?.displayName
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  <p>
                    {currentUser && currentUser.email !== null ? (
                      <span>
                        <span className="fw-bold">Email: </span>
                        {currentUser.email}
                      </span>
                    ) : currentUser && currentUser.providerData.length > 0 ? (
                      <span>
                        <span className="fw-bold">Login By: </span>
                        {getProviderDisplayName(
                          currentUser.providerData[0].providerId
                        )}{" "}
                        Account
                      </span>
                    ) : (
                      <FallingLines
                        color="rgb(138, 61, 93)"
                        width="20"
                        visible={true}
                        ariaLabel="falling-lines-loading"
                      />
                    )}
                  </p>
                  {currentUser &&
                  (currentUser.phone || currentUser.phoneNumber) ? (
                    <p>
                      <span className="fw-bold">Phone: </span>
                      {currentUser.phone || currentUser.phoneNumber}
                    </p>
                  ) : null}
                  <Row>
                    {firebaseUsers === null &&
                    currentUser &&
                    getProviderDisplayName(
                      currentUser.providerData[0].providerId
                    ) !== "Unknown" ? (
                      <Col lg={6} md={6} sm={12}>
                        <div className="actions_buttons">
                          <button>Join To ONESTOP Members</button>
                        </div>
                      </Col>
                    ) : (
                      <>
                        <Col lg={6} md={6} sm={12}>
                          <div className="actions_buttons">
                          <button onClick={() => fileInputRef.current.click()}>
        Edit Image
      </button>
      {/* input مخفي لرفع الصورة */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
                          </div>{" "}
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <div className="actions_buttons2">
                            <button
                            onClick={() => setShowModal(true)} className="actions_buttons2"
                            >
                            Edit Account
                            </button>
                          </div>

                          <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update or Delete Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new name"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter new email (optional)"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

                          
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>

          <Container className="mt-4">
            <Row>
              <Col md={6} lg={4}>
                <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                  <span></span>
                  <div className="services_desc">
                    <h3>Orders</h3>
                    <h4 className="text-muted">{ordersCount}</h4>
                  </div>
                </motion.div>
              </Col>

              <Col md={6} lg={4}>
                <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                  <span></span>
                  <div className="services_desc">
                    <h3>Checkedout</h3>
                    <h4 className="text-muted">{completedOrdersCount}</h4>
                  </div>
                </motion.div>
              </Col>

              <Col md={6} lg={4}>
                <motion.div whileHover={{ scale: 1.1 }} className="service_item">
                  <span></span>
                  <div className="services_desc">
                    <h3>Favourites</h3>
                    <h4 className="text-muted">{favProductsCount}</h4>
                  </div>
                </motion.div>
              </Col>
            </Row>

            <Row>
              <Col lg={8} md={8} sm={12}>
                <section className="tab_section mt-2 pt-4">
                  <Container>
                    <Row>
                      <Col md={12} lg={12}>
                        <div className="tab_wrapper d-flex align-items-center gap-5">
                          <motion.h5
                            whileTap={{ scale: 1.1 }}
                            className={`pr-4 ${
                              tab === "orders" ? "active_tab" : ""
                            }`}
                            onClick={() => setTab("orders")}
                          >
                            Orders
                          </motion.h5>
                          <motion.h5
                            whileTap={{ scale: 1.1 }}
                            className={`pr-4 ${
                              tab === "favourites" ? "active_tab" : ""
                            }`}
                            onClick={() => setTab("favourites")}
                          >
                            Favourites
                          </motion.h5>
                          <motion.h5
                            whileTap={{ scale: 1.1 }}
                            className={tab === "checkedout" ? "active_tab" : ""}
                            onClick={() => setTab("checkedout")}
                          >
                            Checkedout
                          </motion.h5>
                        </div>
                        <div className="tab_content">
                          {tab === "orders" ? (
                            <>

                            <div className="d-flex align-items-center justify-content-between mt-4">
                            <h5 className="">Orders</h5>

  <div className="filter_widget">
  <label htmlFor="filter" className="pr-2">
  Filter By State
  </label>
  <select id="filter" >
  <option value="all">All</option>
  <option value="request">Requested</option>
  <option value="declined">Declined</option>
  <option value="accepted">Accepted</option>
  <option value="complete">Completed</option>
  </select>
  </div>
                            </div>

                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <th>ID</th>
                                    <th>Items Qty</th>
                                    <th>Total Price</th>
                                    <th>State</th>
                                    <th>Actions</th>
                                  </thead>
                                  <tbody>
                                    {orders &&
                                    orders.filter(
                                      (item) => item.userId === currentUser?.uid
                                    )
                                    .length === 0 &&
                                    !ordersLoading ? (
                                      <tr>
                                        <h4>There is no orders</h4>
                                      </tr>
                                    ) : ordersLoading ? (
                                      <tr>
                                        <h4>please wait orders...</h4>
                                      </tr>
                                    ) : (
                                      orders
                                        .filter(
                                          (item) =>
                                            item.userId === currentUser.uid ||
                                            currentUser.userId
                                        )
                                        .map((item) => (
                                          <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.cartItems.length + 1}</td>
                                            <td>{item.totalAmount}</td>
                                            <td>{item.state}</td>
                                            <td className="d-flex align-items-center justify-content-between">
                                              <span className="mr-3">
                                                <motion.span
                                                  whileTap={{ scale: 1.2 }}
                                                  className="pr-2"
                                                >
                                <Link to={`/orders/${item.id}`}>
                                  <InformationLine className="Icon" />
                                </Link>
                                                </motion.span>
                                              </span>
                                              <span>
                                                <motion.span
                                                  whileTap={{ scale: 1.2 }}
                                                  className="pr-2"
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
                            </>
                          ) : tab === "favourites" ? (
                            <>
                              <div className="d-flex align-items-center justify-content-between mt-4">
                                <h5 className="">Favourites</h5>
                              </div>
                          
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Image</th>
                                      <th>Title</th>
                                      <th>Price</th>
                                      <th>Category</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {productsLoading ? (
                                      <tr>
                                        <td colSpan="6">Please wait, loading favourite products...</td>
                                      </tr>
                                    ) : products?.filter(product => product.likedBy?.includes(currentUser?.uid)).length === 0 ? (
                                      <tr>
                                        <td colSpan="6">You don't have any favourite products yet.</td>
                                      </tr>
                                    ) : (
                                      products
                                        .filter(product => product.likedBy?.includes(currentUser?.uid))
                                        .map((product) => (
                                          <tr key={product.id}>
                                            <td>
                                              <img
                                                src={product.img}
                                                alt={product.productName}
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                              />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.category}</td>
                                            <td>
                                              <motion.span whileTap={{ scale: 1.2 }} className="pr-2">
                                                <Link to={`/shop/${product.id}`}>
                                                  <InformationLine className="Icon" />
                                                </Link>
                                              </motion.span>
                                            </td>
                                          </tr>
                                        ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : tab === "checkedout" ? (
                            <>
                              <div className="d-flex align-items-center justify-content-between mt-4">
                                <h5 className="">Checkedout Orders</h5>
                              </div>
                          
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Items Qty</th>
                                      <th>Total Price</th>
                                      <th>State</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ordersLoading ? (
                                      <tr>
                                        <td colSpan="5">Please wait, loading orders...</td>
                                      </tr>
                                    ) : orders?.filter(
                                        (item) =>
                                          item.userId === currentUser?.uid &&
                                          item.state === "accepted"
                                      ).length === 0 ? (
                                      <tr>
                                        <td colSpan="5">No accepted (checkedout) orders found.</td>
                                      </tr>
                                    ) : (
                                      orders
                                        .filter(
                                          (item) =>
                                            item.userId === currentUser?.uid &&
                                            item.state === "complete"
                                        )
                                        .map((item) => (
                                          <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.cartItems.length + 1}</td>
                                            <td>{item.totalAmount}</td>
                                            <td>{item.state}</td>
                                            <td className="d-flex align-items-center justify-content-between">
                                              <span className="mr-3">
                                                <motion.span whileTap={{ scale: 1.2 }} className="pr-2">
                                                  <Link to={`/dashboard/orders/${item.id}`}>
                                                    <InformationLine className="Icon" />
                                                  </Link>
                                                </motion.span>
                                              </span>
                                              <span>
                                                <motion.span whileTap={{ scale: 1.2 }} className="pr-2">
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
                            </>
                          ) : null}
                          
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </section>
              </Col>

              <Col lg={4} md={4} sm={12}>
                <div className="preparing_orders pt-4 mt-2">
                  <h5>Upcoming Delivery</h5>
                  <div className="order"></div>
                </div>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col lg={8} md={8} sm={12}></Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    );
  };

  export default Profile;
