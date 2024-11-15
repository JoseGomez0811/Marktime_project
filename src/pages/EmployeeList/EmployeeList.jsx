import React, { useState, useEffect } from 'react';
import styles from "./EmployeeList.module.css";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useUserContext } from "../../contexts/UserContext";
import { Loading } from "../../components/Loading/Loading";

export default function UserList() {
    const { user } = useUserContext(); // Usuario actual autenticado
    const [allUsers, setAllUsers] = useState([]); // Lista de todos los usuarios
    const [selectedUser, setSelectedUser] = useState(null);
    const [editableUser, setEditableUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula una carga de datos
        setTimeout(() => {
        setIsLoading(false);
        }, 3000);
    }, []);

    // Función para obtener todos los usuarios de Firebase
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

    // useEffect para cargar usuarios al montar el componente y configurar el intervalo
    useEffect(() => {
        fetchUsers(); // Llama a la función una vez al cargar el componente

        const intervalId = setInterval(() => {
            fetchUsers(); // Llama a la función cada 5 segundos
        }, 5000);

        // Limpieza del intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditableUser(selectedUser); // Cargar datos del usuario seleccionado para editar
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Nueva función para actualizar solo el usuario en la base de datos
    const updateEmployee = async (id, updatedData) => {
        const userRef = doc(db, 'Registro-Empleados', id);
        try {
            await updateDoc(userRef, updatedData);
            // Actualizamos localmente la lista sin cambiar el usuario autenticado
            setAllUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
            );
        } catch (error) {
            console.error("Error al actualizar el empleado:", error);
        }
    };

    const handleSave = async () => {
        if (!editableUser?.id) {
            console.error("No se pudo encontrar el ID del usuario.");
            return;
        }
        try {
            await updateEmployee(
                editableUser.id, // ID del empleado
                editableUser      // Datos actualizados del empleado
            );
            setSelectedUser(editableUser); // Actualizar la vista del usuario seleccionado
            setIsEditing(false); // Salir del modo edición
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    // if (!allUsers.length) {
    //     return <div>Cargando usuarios...</div>;
    // }

    // Verifica si el cargo es "Recursos Humanos"
    const isHR = user?.Cargo === "Recursos Humanos";

    return (
        <div>
            {isLoading && <Loading />}
            {!isLoading && (
        <div className={styles.mainContainer}>
            <div className={styles.container1}>
                <div className={styles.userList1}>
                    {allUsers.map((userData) => (
                        <div
                            key={userData.id}
                            className={`${styles.userCard1} 
                                ${userData.Status === 'Desconectado' ? styles.disconnected1 : ''} 
                                ${selectedUser?.id === userData.id ? styles.selected1 : ''}`}
                            onClick={() => {
                                setSelectedUser(userData);
                                setEditableUser(userData); // Cargar usuario seleccionado
                                setIsEditing(false); // Asegurarse de que no esté en modo edición al seleccionar
                            }}
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
                                        <input
                                            type="text"
                                            id="cedula"
                                            name="Cédula"
                                            className={styles.input}
                                            value={editableUser?.Cédula || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Cédula" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="telefono">Número de teléfono:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="telefono"
                                            name="NumeroDeTelefono"
                                            className={styles.input}
                                            value={editableUser?.NumeroDeTelefono || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Número de teléfono" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="email">Correo electrónico:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="email"
                                            name="Correo"
                                            className={styles.input}
                                            value={editableUser?.Correo || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Correo electrónico" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="cargo">Cargo:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="cargo"
                                            name="Cargo"
                                            className={styles.input}
                                            value={editableUser?.Cargo || ""}
                                            onChange={handleChange}
                                            readOnly={!isHR || !isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Cargo" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="sueldo">Sueldo:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="sueldo"
                                            name="Sueldo"
                                            className={styles.input}
                                            value={editableUser?.Sueldo || ""}
                                            onChange={handleChange}
                                            readOnly={!isHR || !isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Sueldo" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="nombreBanco">Nombre del banco:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="nombreBanco"
                                            name="Banco[0]"
                                            className={styles.input}
                                            value={editableUser?.Banco[0] || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Nombre del banco" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="numeroCuenta">Número de cuenta:</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            id="numeroCuenta"
                                            name="Banco[1]"
                                            className={styles.input}
                                            value={editableUser?.Banco[1] || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                        {isHR && (
                                            <button className={styles.editButton} aria-label="Editar Número de cuenta" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.containerButton}>
                                    {isEditing && (
                                        <button onClick={handleSave} className={styles.saveButton}>
                                        Guardar cambios
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.noUser}>No se ha seleccionado ningún usuario.</div>
                    )}
                </div>
            </div>
        </div>
        )}
    </div>
    );
}