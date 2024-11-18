import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";
import { getUserProfile } from "../firebase/users-service"; // Importa la función para obtener datos del usuario desde Firestore

// Método para registrar un nuevo usuario sin cambiar el usuario autenticado
export const registerWithEmailAndPassword = async (email, password) => {
  const currentUser = auth.currentUser; // Obtén el usuario autenticado actual
  let currentEmail, currentPassword;

  if (currentUser) {
    currentEmail = currentUser.email;

    try {
      // Obtén la información del usuario actual desde Firestore
      const userProfile = await getUserProfile(currentEmail);
      if (userProfile && userProfile.Password) {
        currentPassword = userProfile.Password; // Extrae la contraseña del perfil
      } else {
        throw new Error(
          "No se encontró la contraseña del usuario actual en Firestore"
        );
      }
    } catch (error) {
      console.error("Error al obtener la contraseña del usuario actual:", error);
      throw error;
    }
  }

  try {
    // Registra el nuevo usuario
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuario registrado exitosamente:", result);

    // Restaura la sesión del usuario actual si estaba autenticado
    if (currentUser) {
      await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
      console.log("Sesión del usuario restaurada exitosamente");
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
};

// Método para iniciar sesión con email y contraseña
export const loginWithEmailAndPassword = async (email, password, onSuccess, onFail) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", result);

    if (onSuccess) {
      onSuccess();
    }
    return true;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    if (onFail) {
      onFail(error);
    }
    return false;
  }
};

// Método para cerrar sesión
export const logout = async (callback) => {
  try {
    await signOut(auth);

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
