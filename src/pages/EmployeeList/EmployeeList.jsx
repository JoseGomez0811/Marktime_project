import React, { useState, useEffect } from 'react';
import styles from "./EmployeeList.module.css";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useUserContext } from "../../contexts/UserContext";
import { Loading } from "../../components/Loading/Loading";

export default function UserList() {
    const { user } = useUserContext();
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editableUser, setEditableUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case "Nombres":
                if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    newErrors[name] = "Los nombres solo pueden contener letras y acentos.";
                } else {
                    delete newErrors[name];
                }
                break;
            case "Apellidos":
                if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    newErrors[name] = "Los apellidos solo pueden contener letras y acentos.";
                } else {
                    delete newErrors[name];
                }
                break;
            case "Cédula":
                if (!value || !/^\d+$/.test(value)) {
                    newErrors[name] = "La cédula solo puede contener dígitos.";
                } else {
                    delete newErrors[name];
                }
                break;
            case "Sueldo":
                if (!value || !/^\d+$/.test(value)) {
                    newErrors[name] = "El sueldo solo puede contener números.";
                } else {
                    delete newErrors[name];
                }
                break;
            case "NumeroDeTelefono":
                if (!value || !/^\+?\d+$/.test(value)) {
                    newErrors[name] = "El número de teléfono solo puede contener dígitos y el signo +.";
                } else {
                    delete newErrors[name];
                }
                break;
            case "Banco":
                if (Array.isArray(value)) {
                    // Validar número de cuenta (índice 1)
                    if (!value[1] || !/^\d+$/.test(value[1])) {
                        newErrors.numeroCuenta = "El número de cuenta solo puede contener dígitos.";
                    } else {
                        delete newErrors.numeroCuenta;
                    }
                }
                break;
            case "Correo":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    newErrors[name] = "El correo electrónico no es válido.";
                } else {
                    delete newErrors[name];
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

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

    useEffect(() => {
        fetchUsers();
        const intervalId = setInterval(() => {
            fetchUsers();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditableUser(selectedUser);
        setErrors({}); // Limpiar errores al comenzar edición
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Manejo especial para el campo Banco que es un array
        if (name.startsWith("Banco[")) {
            const index = parseInt(name.charAt(6));
            setEditableUser(prev => {
                const newBanco = [...(prev.Banco || ["", ""])];
                newBanco[index] = value;
                const newUser = { ...prev, Banco: newBanco };
                validateField("Banco", newBanco);
                return newUser;
            });
        } else {
            setEditableUser(prev => {
                const newUser = { ...prev, [name]: value };
                validateField(name, value);
                return newUser;
            });
        }
    };

    const updateEmployee = async (id, updatedData) => {
        const userRef = doc(db, 'Registro-Empleados', id);
        try {
            await updateDoc(userRef, updatedData);
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

        // Validar todos los campos antes de guardar
        let isValid = true;
        const fieldsToValidate = ['Nombres', 'Apellidos', 'Cédula', 'NumeroDeTelefono', 'Correo', 'Sueldo', 'Banco'];
        
        fieldsToValidate.forEach(field => {
            if (field === 'Banco') {
                isValid = validateField(field, editableUser[field]) && isValid;
            } else {
                isValid = validateField(field, editableUser[field]) && isValid;
            }
        });

        if (!isValid) {
            return; // Detener el guardado si hay errores
        }

        try {
            await updateEmployee(editableUser.id, editableUser);
            setSelectedUser(editableUser);
            setIsEditing(false);
            setErrors({});
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

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
                                        {isHR && !isEditing && (
                                            <button className={styles.editButton} aria-label="Editar Cédula" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                    {errors.Cédula && <span className={styles.errorText}>{errors.Cédula}</span>}
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
                                        {isHR && !isEditing && (
                                            <button className={styles.editButton} aria-label="Editar Número de teléfono" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                    {errors.NumeroDeTelefono && <span className={styles.errorText}>{errors.NumeroDeTelefono}</span>}
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
                                        {isHR && !isEditing && (
                                            <button className={styles.editButton} aria-label="Editar Correo electrónico" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                    {errors.Correo && <span className={styles.errorText}>{errors.Correo}</span>}
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="cargo">Cargo:</label>
                                    <div className={styles.inputContainer}>
                                        <select
                                            type="text"
                                            id="cargo"
                                            name="Cargo"
                                            className={styles.input}
                                            value={editableUser?.Cargo || ""}
                                            onChange={handleChange}
                                            readOnly={!isHR || !isEditing}
                                        >
                                            <option value="">Seleccione:</option>
                                            <option value="Empleado">Empleado</option>
                                            <option value="Empleador">Empleador</option>
                                            <option value="Recursos Humanos">Recursos Humanos</option>
                                        </select>
                                        {isHR && !isEditing && (
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
                                        {isHR && !isEditing && (
                                            <button className={styles.editButton} aria-label="Editar Sueldo" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                    {errors.Sueldo && <span className={styles.error}>{errors.Sueldo}</span>}
                                </div>
                                <div className={styles.infoField}>
                                    <label htmlFor="nombreBanco">Nombre del banco:</label>
                                    <div className={styles.inputContainer}>
                                        <select
                                            type="text"
                                            id="nombreBanco"
                                            name="Banco[0]"
                                            className={styles.input}
                                            value={editableUser?.Banco[0] || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        >
                                            <option value="">Seleccione:</option>
                                            <option value="Banco de Venezuela">Banco de Venezuela</option>
                                            <option value="Banco Bicentenario">Banco Bicentenario</option>
                                            <option value="Bancamiga">Bancamiga</option>
                                            <option value="Banco Provincial">Banco Provincial</option>
                                            <option value="Banco Mercantil">Banco Mercantil</option>
                                            <option value="Banco Nacional de Crédito">Banco Nacional de Crédito</option>
                                            <option value="Banco Exterior">Banco Exterior</option>
                                            <option value="Banesco">Banesco</option>
                                            <option value="Banco Plaza">Banco Plaza</option>
                                            <option value="Bancaribe">Bancaribe</option>
                                            <option value="BanPlus">BanPlus</option>
                                            <option value="Banco Venezolano de Crédito">Banco Venezolano de Crédito</option>
                                        </select>
                                        {isHR && !isEditing && (
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
                                        {isHR && !isEditing && (
                                            <button className={styles.editButton} aria-label="Editar Número de cuenta" onClick={handleEdit}>
                                                <span className={styles.editIcon}></span>
                                            </button>
                                        )}
                                    </div>
                                    {errors.numeroCuenta && <span className={styles.errorText}>{errors.numeroCuenta}</span>}
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