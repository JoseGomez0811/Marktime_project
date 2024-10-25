import { Link, useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css"; // Asegúrate de que los estilos estén definidos
import { useUserContext } from "../../contexts/UserContext";
import { logout } from "../../../firebase/auth-service";
import React from "react";
import { LogOut, User, Users, UserPlus, Activity } from "lucide-react";
import { TRACKING_URL, REGISTER_URL, LOGIN_URL } from "../../constants/urls";

export const Sidebar = () => {
  const { user } = useUserContext(); // Traemos el contexto de usuario
  const navigate = useNavigate(); // Para redirigir después del logout
  
  console.log('Usuario:', user);

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout(); // Llama la función logout de tu servicio
      navigate(LOGIN_URL); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className={styles.sidebar}> {/* Usa la clase de estilo correcta */}
      <div className={styles.sidebarHeader}>
        <img src="/Marktime-logo-2.svg" alt="Logo de la empresa" className={styles.companyLogo} />
        <h1 className={styles.companyName}>Marktime</h1>
      </div>

      <div className={styles.userInfo}>
        <span className={styles.userName}>
          {user?.Nombres + ' ' + user?.Apellidos || user?.displayName || "Usuario Anónimo"}
        </span>
      </div>

      <nav className={styles.sidebarNav}>
        <Link to="/profile" className={styles.navItem}>
          <User size={20} />
          <span>Perfil</span>
        </Link>

        {/* Renderiza según el tipo de usuario */}
        {user?.Cargo === 'Empleado' && (
          <Link to={TRACKING_URL} className={styles.navItem}>
            <Activity size={20} />
            <span>Tracking</span>
          </Link>
        )}

        {(user?.Cargo === 'Empleador' || user?.Cargo === 'Recursos Humanos') && (
          <Link to="/employees" className={styles.navItem}>
            <Users size={20} />
            <span>Listado de Empleados</span>
          </Link>
        )}

        {user?.Cargo === 'Recursos Humanos' && (
          <Link to={REGISTER_URL} className={styles.navItem}>
            <UserPlus size={20} />
            <span>Registrar Empleado</span>
          </Link>
        )}
      </nav>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
};
