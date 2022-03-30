import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { getDocById } from "../firestore/firestoreService.js";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState();
  const [authIsReady, setAuthIsReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const getUserData = async () => {
        if (!user) {
          setLoggedInUser(null);
          return;
        }

        const userData = await getDocById("users", user.uid);
        const currentUser = {
          id: user.uid,
          email: user.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          isAdmin: userData.isAdmin,
          uid: user.uid,
        };
        setLoggedInUser(currentUser);
      };

      getUserData();

      setAuthIsReady(true);
      unsub();
    });
  }, []);

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    authIsReady,
    loggedInUser,
    setLoggedInUser,
    resetPassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
