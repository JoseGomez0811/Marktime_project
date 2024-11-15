import styles from "../NotFoundPage/NotFoundPage.module.css";
import { Link } from 'react-router-dom';
import { LOGIN_URL } from "../../constants/urls";
import { Loading } from "../../components/Loading/Loading";
import React, { useState, useEffect } from "react";

export function NotFoundPage() {

  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula una carga de datos
        setTimeout(() => {
        setIsLoading(false);
        }, 3000);
    }, []);

    return (
      <div>
            {isLoading && <Loading />}
            {!isLoading && (
        <div className={styles["not-found-container"]}>
          <h1 className={styles["not-found-title"]}>404</h1>
          <div className={styles["not-found-content"]}>
            <h2 className={styles["not-found-subtitle"]}>Página no encontrada</h2>
            <p className={styles["not-found-text"]}>Lo sentimos, para acceder a esta página debes ser un usuario autorizado.</p>
            <Link to={LOGIN_URL} className={styles["not-found-link"]}>
              Iniciar Sesión
            </Link>
          </div>
        </div>
        )}
    </div>
    );
        
}