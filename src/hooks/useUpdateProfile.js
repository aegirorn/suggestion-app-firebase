import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import { updateEmail, updatePassword } from "firebase/auth";
import { updateDocument } from "../firestore/firestoreService";
import { useAuthContext } from "./useAuthContext";

export const useUpdateProfile = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { loggedInUser, setLoggedInUser } = useAuthContext();

  const updateNames = async (firstName, lastName, displayName) => {
    setError(null);
    setIsPending(true);
    setSuccess(null);

    try {
      // Update
      const updatedUser = { ...loggedInUser, firstName, lastName, displayName };

      console.log("updated user: ", updatedUser);

      await updateDocument("users", updatedUser);
      setLoggedInUser({ ...loggedInUser, firstName, lastName, displayName });

      if (!isCancelled) {
        setError(null);
        setSuccess("Your profile has been updated.");
        setIsPending(false);
      }
    } catch (err) {
      console.log("Error in updateDocument: ", err);
      if (!isCancelled) {
        setIsPending(false);
        setError(err.message);
        setSuccess(null);
      }
    }
  };

  const updateUserEmail = async (email) => {
    setError(null);
    setIsPending(true);
    setSuccess(null);

    try {
      await updateEmail(auth.currentUser, email);
      await updateDocument("users", { ...loggedInUser, email });
      setLoggedInUser({ ...loggedInUser, email });

      if (!isCancelled) {
        setError(null);
        setSuccess("Your email has been updated.");
        setIsPending(false);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setSuccess(null);
        setIsPending(false);
      }
    }
  };

  const updateUserPassword = async (password) => {
    setError(null);
    setSuccess(null);
    setIsPending(true);

    try {
      await updatePassword(auth.currentUser, password);
      setSuccess("Your password has been updated.");
      setIsPending(false);

      if (!isCancelled) {
        setSuccess("Your password has been updated.");
        setIsPending(false);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setSuccess(null);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return {
    error,
    isPending,
    success,
    updateNames,
    updateUserEmail,
    updateUserPassword,
  };
};
