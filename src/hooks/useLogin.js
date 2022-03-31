import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const { setLoggedInUser } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // sign the user in
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res) {
        if (!isCancelled) {
          setIsPending(false);
        }
        throw new Error("Could not get user.");
      }

      const docRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentUser = {
          ...docSnap.data(),
          email: res.user.email,
          uid: res.user.uid,
        };
        setLoggedInUser(currentUser);
      } else {
        // doc.data() will be undefined in this case
        throw new Error("User not found.");
      }

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      console.log(err.message);

      if (!isCancelled) {
        setIsPending(false);

        if (err.message === "Firebase: Error (auth/wrong-password).") {
          setError("Login failed");
        } else {
          setError(err.message);
        }
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};
