import { db } from "../firebase/firebase-config";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export const getDocById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists) {
    return docSnap.data();
  }

  return null;
};

export const updateDocument = async (collectionName, docToUpdate) => {
  const docRef = doc(db, collectionName, docToUpdate.id);
  await updateDoc(docRef, docToUpdate);
};

export const addDocument = async (collectionName, docToAdd) => {
  const docRef = await addDoc(collection(db, collectionName), docToAdd);
  return docRef.id;
};

export const getUserSuggestions = async (userId) => {
  const q = query(
    collection(db, "suggestions"),
    where("author.id", "==", userId),
    orderBy("dateCreated", "desc")
  );

  const querySnapshot = await getDocs(q);
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push(transformDoc(doc));
  });

  return results;
};

export function transformDoc(doc) {
  const data = doc.data();
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: doc.id,
  };
}
