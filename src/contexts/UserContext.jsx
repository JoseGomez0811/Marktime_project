import React, { useContext, createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
}

useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoadingUser(true);
      if (firebaseUser && !user) {
        const userProfile = await getUserProfile(firebaseUser.email);
        setUser(userProfile);
      } else {
        setUser(null);
      }

      setIsLoadingUser(false);
    });
  }, []);