import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import { signOut } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const { setLoggedInUser } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // sign the user out
      await signOut(auth);
      setLoggedInUser(null);

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      console.log(err.message);

      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
