// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBD29gfHstZxPHMCZwYz27H3N3D69GkXFo",
  authDomain: "db-marktime.firebaseapp.com",
  projectId: "db-marktime",
  storageBucket: "db-marktime.appspot.com",
  messagingSenderId: "907550575420",
  appId: "1:907550575420:web:fa8c5f6333348f82faec39",
  measurementId: "G-L7BBMYTHM9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de los servicios de Firebase que necesitas
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Si necesitas analytics en el futuro, descomenta la línea de abajo:
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);