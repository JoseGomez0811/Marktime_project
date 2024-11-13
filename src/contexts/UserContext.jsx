import React, { useContext, useState } from "react";
import { auth } from "../../firebase/config";
import { getUserProfile, updateUserProfile } from "../../firebase/users-service";

export const UserContext = React.createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para cargar el perfil del usuario al iniciar sesión desde Login
  const loginUser = async (email) => {
    setLoading(true);
    try {
      const userProfile = await getUserProfile(email);
      if (userProfile) {
        setUser({
          ...userProfile,
          id: String(userProfile.id),
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
      setUser(null);
    }
    setLoading(false);
  };

  const loadEmployees = async () => {
    const fetchedEmployees = await getUser();
    setEmployees(fetchedEmployees);
  };

  const updateUser = async (userId, userData) => {
    try {
      if (typeof userId !== "string") return;
      const result = await updateUserProfile(userId, userData);
      if (result) {
        setUser((prev) => ({ ...prev, ...userData }));
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        updateUser,
        employees,
        loadEmployees,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
