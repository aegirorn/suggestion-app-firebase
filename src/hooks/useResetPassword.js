import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";

export const useResetPassword = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const resetPassword = async (email) => {
    setError(null);
    setIsPending(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsPending(false);
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
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

  return { error, isPending, resetPassword };
};
