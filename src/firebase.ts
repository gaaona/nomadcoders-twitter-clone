// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuwh4qf_BodhaKVVqbC-pFYUf76Pf4AkI",
  authDomain: "nwitter-reloaded-368d0.firebaseapp.com",
  projectId: "nwitter-reloaded-368d0",
  storageBucket: "nwitter-reloaded-368d0.firebasestorage.app",
  messagingSenderId: "215848869827",
  appId: "1:215848869827:web:b68854845c8fe332c1a776",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
