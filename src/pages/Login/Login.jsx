import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { PROFILE_URL } from "../../constants/urls";
import { loginWithEmailAndPassword } from "../../../firebase/auth-service";
import { useUserContext } from "../../contexts/UserContext";

import { Alert } from "@material-tailwind/react";

export function Login() {
  const navigate = useNavigate();
  const { loginUser } = useUserContext();
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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

  const onSuccess = async() => {
    setShowSuccessAlert(true);
    await loginUser(formData.correo);
    setTimeout(() => {
      
      navigate(PROFILE_URL);
    }, 2000);
  };

  const onFail = (_error) => {
    console.log("LOGIN FAILED, Try Again");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        await loginWithEmailAndPassword(formData.correo, formData.password, onSuccess, onFail);
      } catch (error) {
        console.error("Error during login:", error);
        onFail(error);
      }
    } else {
      console.log("Campos incorrectos");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function Icon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <div className={styles.root}>
      {showSuccessAlert && (
        <Alert
          icon={<Icon />}
          className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
        >
          Inicio de sesión exitoso
        </Alert>
      )}
      
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