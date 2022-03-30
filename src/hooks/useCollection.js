import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebase-config";

//firebase imports
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export const useCollection = (collectionName, _filters, _direction) => {
  const [documents, setDocuments] = useState(null);

  //set up query
  const filters = useRef(_filters).current;
  const direction = useRef(_direction).current;

  useEffect(() => {
    let ref = collection(db, collectionName);

    if (filters) {
      filters.forEach((filter) => {
        ref = query(
          ref,
          where(
            filter.conditionName,
            filter.conditionType,
            filter.conditionValue
          )
        );
      });
    }

    if (direction) {
      direction.forEach((d) => {
        if (d.desc) {
          ref = query(ref, orderBy(d.fieldName, "desc"));
        } else {
          ref = query(ref, orderBy(d.fieldName));
        }
      });
    }

    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push(transformDoc(doc));
      });
      setDocuments(results);
    });

    return () => unsub();
  }, [collectionName, filters, direction]);

  return { documents };
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
