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
  const [shouldUpdateContext, setShouldUpdateContext] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.email);

          if (userProfile) {
            setUser((prevUser) => {
              // Evita sobrescribir el usuario si ya está en el contexto
              if (prevUser && prevUser.id === userProfile.id) return prevUser;
              return {
                ...userProfile,
                id: String(userProfile.id),
              };
            });

            // Actualiza el estado del empleado si corresponde
            if (
              userProfile.Cargo === "Empleador" ||
              userProfile.Cargo === "Recursos Humanos"
            ) {
              setStatus("Trabajando");
              await updateEmployeeStatus(userProfile.Cédula, "Trabajando");
              console.log("Estado actualizado a Trabajando");
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

      setLoading(false); // Finaliza la carga
    });

    return () => unsubscribe();
  }, [shouldUpdateContext]); // Escucha cambios en shouldUpdateContext

  const forceUpdateContext = () => {
    setShouldUpdateContext(true);
  };

  const blockContextUpdate = () => {
    setShouldUpdateContext(false);
  };

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

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        forceUpdateContext,
        blockContextUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
