import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { TRACKING_URL, REGISTER_URL, PROFILE_URL } from "../../constants/urls";
import { loginWithEmailAndPassword } from "../../../firebase/auth-service";

export function Login() {
  const navigate = useNavigate();

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

  const onSuccess = () => {
    navigate(PROFILE_URL);
  };

  const onFail = (_error) => {
    console.log("LOGIN FAILED, Try Again");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const result = await loginWithEmailAndPassword(
        formData.correo,
        formData.password,
        onSuccess,
        onFail
      );
      console.log("Formulario de login enviado:", formData);
    } else {
      console.log("Campos incorectos");
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
              {errors.correo && (
                <span className={styles.error}>{errors.correo}</span>
              )}
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
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitBtn}>
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
