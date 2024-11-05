import React, { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import styles from "./ProfileEmployee.module.css";
import { swapIDHourRegistry } from "../../../firebase/users-service";

export default function ProfileEmployee() {
  const { user, updateUser } = useUserContext();
  const isHR = user?.Cargo === "Recursos Humanos";
  const [oldCedula, setOldCedula] = useState(user?.Cédula ?? "");
  const [newCedula, setNewCedula] = useState("");
  const [editableUser, setEditableUser] = useState({
    Cedula: user?.Cédula ?? "",
    NumeroDeTelefono: user?.NumeroDeTelefono ?? "",
    Correo: user?.Correo ?? "",
    Cargo: user?.Cargo ?? "",
    Sueldo: user?.Sueldo ?? "",
    Banco: user?.Banco ?? ["", ""],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setEditableUser({
        Cedula: user.Cédula ?? "",
        NumeroDeTelefono: user.NumeroDeTelefono ?? "",
        Correo: user.Correo ?? "",
        Cargo: user.Cargo ?? "",
        Sueldo: user.Sueldo ?? "",
        Banco: user.Banco ?? ["", ""],
      });
    }

    if (oldCedula === "" || oldCedula != user?.Cédula) {
      // console.log("primera cedula: " + oldCed);
      setOldCedula(oldCedula);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("Banco")) {
      const index = name.split("[")[1][0];
      setEditableUser((prev) => {
        const newBanco = [...prev.Banco];
        newBanco[index] = value;
        return { ...prev, Banco: newBanco };
      });
    } else {
      setEditableUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeCedula = (e) => {
    const { value } = e.target;
    setEditableUser((prev) => ({ ...prev, Cedula: value }));
    setNewCedula(value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) {
      console.error("No se pudo encontrar el ID del usuario.");
      return;
    }
    try {
      await updateUser(String(user.id), {
        Cédula: editableUser.Cedula,
        NumeroDeTelefono: editableUser.NumeroDeTelefono,
        Correo: editableUser.Correo,
        Cargo: editableUser.Cargo,
        Sueldo: editableUser.Sueldo,
        Banco: editableUser.Banco,
      });

      if (oldCedula !== newCedula) {
        await swapIDHourRegistry(oldCedula, newCedula);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.userHeader}>
        <div className={styles.userAvatar}></div>
        <h2 className={styles.userName}>
          {user?.Nombres + " " + user?.Apellidos ||
            user?.displayName ||
            "Usuario Anónimo"}
        </h2>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.infoField}>
          <label htmlFor="cedula">Cédula:</label>
          <div className={styles.inputContainer}>
            <input
              type="text"
              id="cedula"
              name="Cedula"
              className={styles.input}
              value={editableUser.Cedula}
              onChange={handleChangeCedula}
              readOnly={!isEditing}
            />
            {isHR && (
              <button
                className={styles.editButton}
                aria-label="Editar Cédula"
                onClick={handleEdit}
              >
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
              value={editableUser.NumeroDeTelefono}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <button
              className={styles.editButton}
              aria-label="Editar Número de teléfono"
              onClick={handleEdit}
            >
              <span className={styles.editIcon}></span>
            </button>
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
              value={editableUser.Correo}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <button
              className={styles.editButton}
              aria-label="Editar Correo electrónico"
              onClick={handleEdit}
            >
              <span className={styles.editIcon}></span>
            </button>
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
              value={editableUser.Cargo}
              onChange={handleChange}
              readOnly={!isHR || !isEditing}
            />
            {isHR && (
              <button
                className={styles.editButton}
                aria-label="Editar Cargo"
                onClick={handleEdit}
              >
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
              value={editableUser.Sueldo}
              onChange={handleChange}
              readOnly={!isHR || !isEditing}
            />
            {isHR && (
              <button
                className={styles.editButton}
                aria-label="Editar Sueldo"
                onClick={handleEdit}
              >
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
              value={editableUser.Banco[0]}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <button
              className={styles.editButton}
              aria-label="Editar Nombre del banco"
              onClick={handleEdit}
            >
              <span className={styles.editIcon}></span>
            </button>
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
              value={editableUser.Banco[1]}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <button
              className={styles.editButton}
              aria-label="Editar Número de cuenta"
              onClick={handleEdit}
            >
              <span className={styles.editIcon}></span>
            </button>
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
    </div>
  );
}