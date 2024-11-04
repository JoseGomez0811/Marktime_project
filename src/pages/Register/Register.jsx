import React, { useState } from "react";
import styles from "./Register.module.css"; // Importa estilos con CSS Modules
import { useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword } from "../../../firebase/auth-service";
import { TRACKING_URL } from "../../constants/urls";
import { toast } from 'react-toastify';
import { insertData } from "../../../firebase/users-service";

export function RegistroUsuario() {
  const notifyError = (mensaje) => toast.error(mensaje);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    cargo: '',
    sueldo: '',
    telefono: '',
    banco: '',
    cuenta: '',
    correo: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.nombres || /\d/.test(formData.nombres)) {
      newErrors.nombres = 'Los nombres no pueden contener números.';
    }
    if (!formData.apellidos || /\d/.test(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos no pueden contener números.';
    }

    if (!formData.telefono || /\D/.test(formData.telefono)) {
      newErrors.telefono = 'El número de teléfono solo puede contener dígitos.';
    }
    if (!formData.cuenta || /\D/.test(formData.cuenta)) {
      newErrors.cuenta = 'El número de cuenta solo puede contener dígitos.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const onSuccess = () => {
    navigate(TRACKING_URL);
  };

  const onFail = (_error) => {
    console.log("REGISTER FAILED, Try Again");
    notifyError("REGISTER FAILED, Try Again");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validate()) {
        const result = await registerWithEmailAndPassword(formData.correo, formData.password);

        await insertData(formData);
        alert("Registro exitoso");

        onSuccess();

      } else {
        console.log("Ocurrio un error desconocido");
        onFail();
      }

    } catch (error) {
      console.error("Error al registrar los datos: ", error);
      alert("Error al registrar los datos");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.root}>
      <h1>Registro de Usuario</h1>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nombres">Nombres:</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
              {errors.nombres && <span className={styles.error}>{errors.nombres}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellidos">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
              {errors.apellidos && <span className={styles.error}>{errors.apellidos}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cargo">Cargo:</label>
              <select
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione:</option>
                <option value="Empleado">Empleado</option>
                <option value="Empleador">Empleador</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="sueldo">Sueldo:</label>
              <input
                type="number"
                id="sueldo"
                name="sueldo"
                value={formData.sueldo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono">Número de Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
              {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="banco">Banco:</label>
              <select
                id="banco"
                name="banco"
                value={formData.banco}
                onChange={handleChange}
                required
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
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cuenta">Número de Cuenta:</label>
              <input
                type="text"
                id="cuenta"
                name="cuenta"
                value={formData.cuenta}
                onChange={handleChange}
                required
              />
              {errors.cuenta && <span className={styles.error}>{errors.cuenta}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="correo">Correo Electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>Registrar</button>
        </form>
      </div>
    </div>
  );
}
