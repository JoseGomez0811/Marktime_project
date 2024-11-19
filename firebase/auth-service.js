import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, fetchSignInMethodsForEmail
} from "firebase/auth";
import { auth } from "./config";


export const registerWithEmailAndPassword = async (
email,
password, 
) => {
try {
const result = await createUserWithEmailAndPassword(auth,email,password);
console.log('EXITO', result);
} catch (error) {
console.log('TODO MAL');
}
};

export const loginWithEmailAndPassword = async (email, password, onSuccess, onFail) => {

try {
  const result = await signInWithEmailAndPassword(auth, email, password);
  console.log('EXITO', result);

  if (onSuccess) {
    alert('Inicio de sesión exitoso');
    onSuccess();
  }
  return true;

} catch (error) {
  console.error("LOGIN FAILED", { error });
  if (onFail) {
    alert("Inicio de sesión fallido")
    onFail(error);
  }
  return false;
}

};

export const logout = async (callback) => {
try {
    await signOut(auth);

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("SIGN OUT FAILED", { error });
  }
}