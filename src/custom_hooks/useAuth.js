import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfigure";
import { collection, doc, getDoc } from "firebase/firestore";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);


      } else {
        // User is signed out
        setCurrentUser(null);
      }

      setLoading(false); // Set loading to false once user data is fetched
    });

    // Clean up the event listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { currentUser, loading };
};

export default useAuth;



