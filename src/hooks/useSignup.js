import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { setLoggedInUser } = useAuthContext();

  const signup = async (email, password, firstName, lastName, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error("Could not complete signup");
      }

      // create a user document
      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        displayName,
        isAdmin: false,
      });

      const user = {
        uid: res.user.uid,
        email: res.user.email,
        firstName,
        lastName,
        displayName,
        isAdmin: false,
      };

      if (!isCancelled) {
        setLoggedInUser(user);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        if (err.message.includes("auth/email-already-in-use")) {
          setError("An account with this email exists already.");
        } else if (err.message.includes("auth/weak-password")) {
          setError("Password should be at least 6 characters.");
        } else {
          setError(err.message);
        }
      }
    } finally {
      if (!isCancelled) {
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
