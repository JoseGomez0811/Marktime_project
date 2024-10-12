import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserProfile } from "../../firebase/users-service";

// Crear un contexto para el usuario
export const UserContext = React.createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar el estado de carga

  useEffect(() => {
    // Listener de cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.email);
          if (userProfile) {
            setUser(userProfile);
            console.log("Usuario encontrado:", userProfile);
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
      setLoading(false); // Se ha completado el proceso de carga
    });

    // Limpiar el listener cuando se desmonte el componente
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga mientras se obtiene el perfil
  }

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para usar el contexto del usuario
export function useUserContext() {
  return useContext(UserContext);
}
