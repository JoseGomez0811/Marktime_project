import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import styles from "./Login.module.css"; 

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Por favor ingrese un correo electrónico válido.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("Formulario de login enviado:", formData);
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
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
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
              {errors.correo && <span className={styles.error}>{errors.correo}</span>}
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
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitBtn}>Iniciar Sesión</button>
          </div>
        </form>
        <div className={styles.registerLinkContainer}>
          <p>¿No tienes una cuenta? <Link to="/registro" className={styles.registerLink}>Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
