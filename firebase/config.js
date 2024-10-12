// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBD29gfHstZxPHMCZwYz27H3N3D69GkXFo",
  authDomain: "db-marktime.firebaseapp.com",
  projectId: "db-marktime",
  storageBucket: "db-marktime.appspot.com",
  messagingSenderId: "907550575420",
  appId: "1:907550575420:web:fa8c5f6333348f82faec39",
  measurementId: "G-L7BBMYTHM9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
//const analytics = getAnalytics(app);