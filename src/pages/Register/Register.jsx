import React, { useState } from "react";
import styles from "./Register.module.css"; // Importa estilos con CSS Modules

const RegistroUsuario = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("Formulario enviado:", formData);
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
              <input
                type="text"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              />
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
              <input
                type="text"
                id="banco"
                name="banco"
                value={formData.banco}
                onChange={handleChange}
                required
              />
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
};

export default RegistroUsuario;
