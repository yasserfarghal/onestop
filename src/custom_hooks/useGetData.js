import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfigure";
import { collection, onSnapshot } from "firebase/firestore";

const useGetData = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (querySnapshot) => {
      const updatedData = querySnapshot.docs.map((product) => ({
        ...product.data(),
        id: product.id,
      }));
      setData(updatedData);
      setLoading(false);
    });

    // Return the cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  return { data, loading };
};

export default useGetData;
