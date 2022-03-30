import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8WRfzb3Nk1rEQRLxLmoxzMJjBU3rae8Q",
  authDomain: "fb-suggestions.firebaseapp.com",
  projectId: "fb-suggestions",
  storageBucket: "fb-suggestions.appspot.com",
  messagingSenderId: "713127360551",
  appId: "1:713127360551:web:af7e1538fde443f203f602",
};

// New Firebase configuration
/* const firebaseConfig = {
  apiKey: "AIzaSyBNC6tvSX3zPeO6liOiI4PqeKjTpOc86oQ",
  authDomain: "suggestion-app-firebase.firebaseapp.com",
  projectId: "suggestion-app-firebase",
  storageBucket: "suggestion-app-firebase.appspot.com",
  messagingSenderId: "916677202302",
  appId: "1:916677202302:web:59acb081df11457e3e632f",
}; */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
};
