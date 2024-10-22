import React from 'react';
import styles from './ProfileEmployee.module.css'
import { useUserContext } from "../../contexts/UserContext";;

export default function ProfileEmployee(){
    const { user } = useUserContext();
    return(
        <div className={styles.userProfile}>
            <div className={styles.userHeader}>
                <div className={styles.userAvatar}></div>
                <h2 className={styles.userName}>{user?.Nombres + ' ' + user?.Apellidos || user?.displayName || "Usuario Anónimo"}</h2>
            </div>
            <div className={styles.userInfo}>
                <div className={styles.infoField}>
                <label htmlFor="cedula">Cédula:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="cedula" name="cedula" className={styles.input} value={user?.Cédula} readOnly />
                    <button className={styles.editButton} aria-label="Editar Cédula">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="telefono">Número de teléfono:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="telefono" name="telefono" className={styles.input} value={user?.NumeroDeTelefono} readOnly />
                    <button className={styles.editButton} aria-label="Editar Número de teléfono">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="email">Correo electrónico:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="email" name="email" className={styles.input} value={user?.Correo} readOnly />
                    <button className={styles.editButton} aria-label="Editar Correo electrónico">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="cargo">Cargo:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="cargo" name="cargo" className={styles.input}  value={user?.Cargo}readOnly />
                    <button className={styles.editButton} aria-label="Editar Cargo">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="sueldo">Sueldo:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="sueldo" name="sueldo" className={styles.input}  value={user?.Sueldo} readOnly />
                    <button className={styles.editButton} aria-label="Editar Sueldo">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="banco">Banco:</label>
                
                </div>
                <div className={styles.infoField}>
                <label htmlFor="nombreBanco">Nombre del banco:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="nombreBanco" name="nombreBanco" className={styles.input} value={user?.Banco[0]} readOnly />
                    <button className={styles.editButton} aria-label="Editar Nombre del banco">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
                <div className={styles.infoField}>
                <label htmlFor="numeroCuenta">Número de cuenta:</label>
                <div className={styles.inputContainer}>
                    <input type="text" id="numeroCuenta" name="numeroCuenta" className={styles.input} value={user?.Banco[1]}readOnly />
                    <button className={styles.editButton} aria-label="Editar Número de cuenta">
                    <span className={styles.editIcon}></span>
                    </button>
                </div>
                </div>
            </div>
            </div>
  );
};
