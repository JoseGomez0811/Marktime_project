import { Link, useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css"; // Asegúrate de que los estilos estén definidos
import { useUserContext } from "../../contexts/UserContext";
import { logout } from "../../../firebase/auth-service";
import React, { useState, useEffect } from "react";
import { LogOut, User, Users, UserPlus, Activity, User2 } from "lucide-react";
import { TRACKING_URL, REGISTER_URL, LOGIN_URL, PROFILE_URL, LIST_URL } from "../../constants/urls";
//import { test } from "../../pages/Tracking/Tracking"
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { updateEmployeeStatus } from "../../../firebase/users-service";

const ConfirmBox = ({ onConfirm, onCancel }) => (
  <div className={styles.overlayConfirmBox}>
    {" "}
    <div className={styles.confirmBox}>
      {" "}
      <p>¿Si cambias de ventana, perderas el registro de las horas trabajadas, primero debes detener el contador?</p>{" "}
      <button className={styles.stopButton2} onClick={onCancel}>
        Ok
      </button>{" "}
    </div>{" "}
  </div>
);

export const Sidebar = () => {
  const { user } = useUserContext(); // Traemos el contexto de usuario
  const navigate = useNavigate(); // Para redirigir después del logout
  const [status, setStatus] = useState("Desconectado");
  const [showConfirm, setShowConfirm] = useState(false);
  
  console.log('Usuario:', user);


  const fetchUsers = async () => {
    try {
      try {
        const userQuery = query(
          collection(db, "Registro-Empleados"),
          where("Correo", "==", user.Correo)
        );
    
        const results = await getDocs(userQuery);
    
        if (results.size > 0) {
          const [user2] = results.docs.map((item) => ({
            ...item.data(),
            id: item.id,
          }));
          return user2.Status;
        } else {
          console.log("No se encontró ningún usuario con el correo proporcionado");
          return null;
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario: ", error);
        throw error;
      }
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
};

useEffect(() => {
  fetchUsers();
  const intervalId = setInterval(() => {
      fetchUsers();
  }, 500);
  return () => clearInterval(intervalId);
}, []);
  
  const handleStop = async () => {
    console.log(user.Cargo)
    const status = await fetchUsers();
    console.log(status)
    if(user.Cargo === "Empleado" && status === "Trabajando"){
      setShowConfirm(true);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate(TRACKING_URL);
  };

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout(); // Llama la función logout de tu servicio
      navigate(LOGIN_URL); // Redirige al login después de cerrar sesión
      setStatus("Desconectado");
      updateEmployeeStatus(user.Cédula, "Desconectado");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside >
      {showConfirm && (
        <ConfirmBox
          onCancel={handleCancel}
        />
      )}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src="../public/download.svg" alt="Logo de la empresa" className={styles.companyLogo}/>
          <h1 className={styles.companyName}>Marktime</h1>
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {user?.Nombres + ' ' + user?.Apellidos || user?.displayName || "Usuario Anónimo"}
          </span>
        </div>

        <nav className={styles.sidebarNav} onClick={handleStop}>
          
          <Link to={PROFILE_URL} className={styles.navItem}>
            <User size={20} className={styles.userIcon}/>
            <span>Perfil</span>
          </Link>

          {/* Renderiza según el tipo de usuario */}
          {user?.Cargo === 'Empleado' && (
            <Link to={TRACKING_URL} className={styles.navItem}>
              <Activity size={20} className={styles.activityIcon}/>
              <span>Registro Horas</span>
            </Link>
          )}

          {(user?.Cargo === 'Empleador' || user?.Cargo === 'Recursos Humanos') && (
            <Link to={LIST_URL} className={styles.navItem}>
              <Users size={20} className={styles.usersIcon}/>
              <span>Listado de Empleados</span>
            </Link>
          )}

          {user?.Cargo === 'Recursos Humanos' && (
            <Link to={REGISTER_URL} className={styles.navItem}>
              <UserPlus size={20} className={styles.userplusIcon}/>
              <span>Registrar Empleado</span>
            </Link>
          )}
        </nav>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={20} className={styles.logoutIcon} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
      
    </aside>
  );
};