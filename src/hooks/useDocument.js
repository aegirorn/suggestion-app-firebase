import { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";

//firebase imports
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const docRef = doc(db, collectionName, id);

    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        // need to make sure the doc exists & has data
        if (snapshot.data()) {
          setDocument(
            transformDataTimestamps({ ...snapshot.data(), id: snapshot.id })
          );
          setError(null);
        } else {
          setError("No such document exists");
        }
        setIsPending(false);
      },
      (err) => {
        console.log(err.message);
        setError("failed to get document");
        setIsPending(false);
      }
    );

    return () => unsub();
  }, [collectionName, id]);

  const updateDocument = (collectionName, docToUpdate) => {
    const docRef = doc(db, collectionName, docToUpdate.id);
    updateDoc(docRef, docToUpdate);
  };
  return { document, error, isPending, updateDocument };
};

function transformDataTimestamps(data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }
  return data;
}
