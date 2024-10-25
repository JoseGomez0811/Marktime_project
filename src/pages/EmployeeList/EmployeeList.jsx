import React, { useState, useEffect } from 'react';
import styles from "./EmployeeList.module.css";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useUserContext } from "../../contexts/UserContext";

export default function UserList(){
    const { user } = useUserContext(); // Usuario actual autenticado
    const [allUsers, setAllUsers] = useState([]); // Lista de todos los usuarios
    const [selectedUser, setSelectedUser] = useState(null);

    // Obtener todos los usuarios de Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Registro-Empleados'));
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllUsers(usersData);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    if (!allUsers.length) {
        return <div>Cargando usuarios...</div>;
    }

    return (
        <div className={styles.mainContainer}>
        <div className={styles.container1}>
            <div className={styles.userList1}>
                {allUsers.map((userData) => (
                    <div
                        key={userData.id}
                        className={`${styles.userCard1} 
                            ${userData.Status === 'Desconectado' ? styles.disconnected1 : ''}
                            ${selectedUser?.id === userData.id ? styles.selected1 : ''}`}
                        onClick={() => setSelectedUser(userData)}
                    >
                        <h3 className={styles.userName1}>
                            {userData.Nombres} {userData.Apellidos}
                        </h3>
                        <p className={styles.userPosition1}>{userData.Cargo || 'Cargo'}</p>
                        <p
                            className={
                            userData.Status === 'Trabajando'
                                ? styles.statusWorking1
                                : styles.statusDisconnected1
                            }
                        >
                            {userData.Status}
                        </p>
                    </div>
                ))}
            </div>
        </div> 
        <div className={styles.container2}>
            <div className={styles.userProfile}>
                {selectedUser ? (
                    <>
                        <div className={styles.userHeader}>
                            <div className={styles.userAvatar}></div>
                            <h2 className={styles.userName}>{selectedUser.Nombres} {selectedUser.Apellidos}</h2>
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.infoField}>
                                <label htmlFor="cedula">Cédula:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="cedula" name="cedula" className={styles.input} value={selectedUser.Cédula} readOnly />
                                    <button className={styles.editButton} aria-label="Editar Cédula">
                                    <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoField}>
                                <label htmlFor="telefono">Número de teléfono:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="telefono" name="telefono" className={styles.input} value={selectedUser.NumeroDeTelefono} readOnly />
                                    <button className={styles.editButton} aria-label="Editar Número de teléfono">
                                    <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoField}>
                                <label htmlFor="email">Correo electrónico:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="email" name="email" className={styles.input} value={selectedUser.Correo} readOnly />
                                    <button className={styles.editButton} aria-label="Editar Correo electrónico">
                                    <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoField}>
                                <label htmlFor="cargo">Cargo:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="cargo" name="cargo" className={styles.input}  value={selectedUser.Cargo}readOnly />
                                    <button className={styles.editButton} aria-label="Editar Cargo">
                                    <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoField}>
                                <label htmlFor="sueldo">Sueldo:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="sueldo" name="sueldo" className={styles.input}  value={selectedUser.Sueldo} readOnly />
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
                                    <input type="text" id="nombreBanco" name="nombreBanco" className={styles.input} value={selectedUser.Banco[0]} readOnly />
                                    <button className={styles.editButton} aria-label="Editar Nombre del banco">
                                        <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoField}>
                                <label htmlFor="numeroCuenta">Número de cuenta:</label>
                                <div className={styles.inputContainer}>
                                    <input type="text" id="numeroCuenta" name="numeroCuenta" className={styles.input} value={selectedUser.Banco[1]}readOnly />
                                    <button className={styles.editButton} aria-label="Editar Número de cuenta">
                                    <span className={styles.editIcon}></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className={styles.auxMessage}>Seleccione un empleado para ver los detalles</p>
                )}
            </div>
        </div>
        </div>
    );
};
