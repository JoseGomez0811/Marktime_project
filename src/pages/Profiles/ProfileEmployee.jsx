import React, { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import styles from "./ProfileEmployee.module.css";
import { swapIDHourRegistry } from "../../../firebase/users-service";
import { Loading } from "../../components/Loading/Loading";

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

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "nombres":
        if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
          newErrors.nombres = "Los nombres solo pueden contener letras y acentos.";
        } else {
          delete newErrors.nombres;
        }
        break;
      case "apellidos":
        if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
          newErrors.apellidos = "Los apellidos solo pueden contener letras y acentos.";
        } else {
          delete newErrors.apellidos;
        }
        break;
      case "Cedula":
        if (!value || /\D/.test(value)) {
          newErrors.Cedula = "La cédula solo puede contener dígitos.";
        } else {
          delete newErrors.Cedula;
        }
        break;
      case "Sueldo":
        if (!value || /\D/.test(value)) {
          newErrors.sueldo = "El sueldo solo puede contener números.";
        } else {
          delete newErrors.sueldo;
        }
        break;
      case "NumeroDeTelefono":
        if (!value || !/^\+?\d+$/.test(value)) {
          newErrors.telefono = "El número de teléfono solo puede contener dígitos y el signo +.";
        } else {
          delete newErrors.telefono;
        }
        break;
      case "Banco[1]":
        if (!value || /\D/.test(value)) {
          newErrors.cuenta = "El número de cuenta solo puede contener dígitos.";
        } else {
          delete newErrors.cuenta;
        }
        break;
      case "Correo":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors.correo = "El correo electrónico no es válido.";
        } else {
          delete newErrors.correo;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

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
    if (oldCedula === "" || oldCedula !== user?.Cédula) {
      setOldCedula(user?.Cédula ?? "");
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
    validateField(name, value);
  };

  const handleChangeCedula = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, Cedula: value }));
    setNewCedula(value);
    validateField(name, value);
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
    <div>
            {isLoading && <Loading />}
            {!isLoading && (
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
            
            {isHR && !isEditing && (
              <button
                className={styles.editButton}
                aria-label="Editar Cédula"
                onClick={handleEdit}
              >
                <span className={styles.editIcon}></span>
              </button>
            )}
          </div>
          {errors.Cedula && <span className={styles.error}>{errors.Cedula}</span>}
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
            {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
            
            {!isEditing &&(
              <button
                className={styles.editButton}
                aria-label="Editar Número de teléfono"
                onClick={handleEdit}
              >
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
              value={editableUser.Correo}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            {errors.correo && <span className={styles.error}>{errors.correo}</span>}
            {!isEditing &&(
              <button
                className={styles.editButton}
                aria-label="Editar Correo electrónico"
                onClick={handleEdit}
              >
                <span className={styles.editIcon}></span>
              </button>
            )}
            
          </div>
        </div>
        <div className={styles.infoField}>
          <label htmlFor="cargo">Cargo:</label>
          <div className={styles.inputContainer}>
            <select
              type="text"
              id="cargo"
              name="Cargo"
              className={styles.input}
              value={editableUser.Cargo}
              onChange={handleChange}
              readOnly={!isHR || !isEditing}
            >
            <option value="">Seleccione:</option>
                <option value="Empleado">Empleado</option>
                <option value="Empleador">Empleador</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            {isHR && !isEditing &&(
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
            {isHR && !isEditing &&(
              <button
                className={styles.editButton}
                aria-label="Editar Sueldo"
                onClick={handleEdit}
              >
                <span className={styles.editIcon}></span>
              </button>
            )}
          </div>
          {errors.sueldo && <span className={styles.error}>{errors.sueldo}</span>}
        </div>
        <div className={styles.infoField}>
          <label htmlFor="nombreBanco">Nombre del banco:</label>
          <div className={styles.inputContainer}>
            <select
              type="text"
              id="nombreBanco"
              name="Banco[0]"
              className={styles.input}
              value={editableUser.Banco[0]}
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
            
            {!isEditing &&(
              <button
                className={styles.editButton}
                aria-label="Editar Nombre del banco"
                onClick={handleEdit}
              >
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
              value={editableUser.Banco[1]}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            {errors.cuenta && <span className={styles.error}>{errors.cuenta}</span>}
            
            {!isEditing &&(
              <button
                className={styles.editButton}
                aria-label="Editar Número de cuenta"
                onClick={handleEdit}
              >
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
    </div>
    )}
    </div>
  );
}