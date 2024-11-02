// components/ProfileEmployee.jsx
import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../contexts/UserContext";
import styles from './ProfileEmployee.module.css';

export default function ProfileEmployee() {
    const { user, updateUser, fetchUser } = useUserContext(); // Asegúrate de que fetchUser esté disponible
    const isHR = user?.Cargo === "Recursos Humanos";

    const [editableUser, setEditableUser] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        cedula: user?.cedula || '',
        cargo: user?.cargo || '',
        sueldo: user?.sueldo || '',
        banco: user?.banco || '',
        numeroCuenta: user?.numeroCuenta || '',
    });

    useEffect(() => {
        // Recuperar el usuario de la base de datos al montar el componente
        const loadUserData = async () => {
            const fetchedUser = await fetchUser(); // Asegúrate de implementar esta función en UserContext
            setEditableUser(fetchedUser);
        };

        loadUserData();
    }, [fetchUser]); // Asegúrate de que fetchUser no cambie innecesariamente

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(editableUser); // Espera a que se complete la actualización
    };

    return (
        <form onSubmit={handleSubmit} className={styles.profileForm}>
            <label>
                Nombre:
                <input
                    type="text"
                    name="nombre"
                    value={editableUser.nombre}
                    onChange={handleChange}
                    disabled={!isHR}
                />
            </label>
            <label>
                Apellido:
                <input
                    type="text"
                    name="apellido"
                    value={editableUser.apellido}
                    onChange={handleChange}
                    disabled={!isHR}
                />
            </label>
            <label>
                Cédula:
                <input
                    type="text"
                    name="cedula"
                    value={editableUser.cedula}
                    onChange={handleChange}
                    disabled={!isHR}
                />
            </label>
            <label>
                Cargo:
                <input
                    type="text"
                    name="cargo"
                    value={editableUser.cargo}
                    onChange={handleChange}
                    disabled={!isHR}
                />
            </label>
            <label>
                Sueldo:
                <input
                    type="text"
                    name="sueldo"
                    value={editableUser.sueldo}
                    onChange={handleChange}
                    disabled={!isHR}
                />
            </label>
            <label>
                Banco:
                <input
                    type="text"
                    name="banco"
                    value={editableUser.banco}
                    onChange={handleChange}
                />
            </label>
            <label>
                Número de Cuenta:
                <input
                    type="text"
                    name="numeroCuenta"
                    value={editableUser.numeroCuenta}
                    onChange={handleChange}
                />
            </label>
            <button type="submit" disabled={!isHR}>Actualizar</button>
        </form>
    );
}
