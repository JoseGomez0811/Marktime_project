import { Sidebar } from "../../components/SideBar/SideBar";
import { Footer } from "../../components/Footer/Footer"
import { Outlet } from "react-router-dom";
import styles from "../Layout/Layout.module.css";
import { UserContextProvider } from "../../contexts/UserContext";

export function Layout() {
    return (
        <div className={styles.container}>
          <Sidebar /> {/* Sidebar a la izquierda */}
          <div className={styles.outletContainer}>
            <Outlet /> {/* Aquí renderizará el contenido principal */}
          </div>
        </div>
      );
}