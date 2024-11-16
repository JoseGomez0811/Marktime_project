import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserProfile, updateUserProfile } from "../../firebase/users-service";
import { updateEmployeeStatus } from "../../firebase/users-service";

export const UserContext = React.createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Desconectado");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.email);
          if (userProfile) {
            setUser({
              ...userProfile,
              id: String(userProfile.id),
            });
            console.log("Usuario encontrado:", userProfile);
            if (userProfile.Cargo === "Empleador" || userProfile.Cargo === "Recursos Humanos"){
              setStatus("Trabajando");
              updateEmployeeStatus(userProfile.Cédula, "Trabajando");
              console.log("Si entro")
            }
          } else {
            console.log("Perfil no encontrado para el usuario autenticado.");
            setUser(null);
          }
        } catch (error) {
          console.error("Error al obtener el perfil del usuario:", error);
          setUser(null);
        }
      } else {
        console.log("No hay un usuario autenticado.");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (userId, userData) => {
    try {
      if (typeof userId !== "string") {
        console.error("Error: El ID del usuario no es una cadena.");
        return;
      }
      const result = await updateUserProfile(userId, userData);
      if (result) {
        console.log("Usuario actualizado con éxito");
        setUser((prev) => ({ ...prev, ...userData })); // Actualiza el estado local
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}