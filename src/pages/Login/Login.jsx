import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { PROFILE_URL } from "../../constants/urls";
import { loginWithEmailAndPassword } from "../../../firebase/auth-service";
import { useUserContext } from "../../contexts/UserContext";
import { Loading } from "../../components/Loading/Loading";
import { updateEmployeeStatus } from "../../../firebase/users-service";



export function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessAlert2, setShowSuccessAlert2] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState("Desconectado");
  //const { user } = useUserContext();

    useEffect(() => {
        // Simula una carga de datos
        setTimeout(() => {
        setIsLoading(false);
        }, 3000);
    }, []);

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
    setTimeout(() => {
      navigate(PROFILE_URL);
    }, 2000);
  };

  const onFail = (_error) => {
    setShowSuccessAlert2(true);
    setTimeout(() => {
      setShowSuccessAlert2(false);
    }, 2000);
    //console.log("LOGIN FAILED, Try Again");
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

      // if (user.Cargo === "Empleador" || user.Cargo === "Recursos Humanos"){
      //   setStatus("Trabajando");
      //   updateEmployeeStatus(user.Cédula, "Trabajando");
      //   console.log("Si entro")
      // }
      
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
    <div>
            {isLoading && <Loading />}
            {!isLoading && (
    <div className={styles.root}>
      {showSuccessAlert && (
        <div className={`${styles.alert} ${styles.success2}`}>
          ¡Inicio de sesión exitoso!
        </div>
      )}

      {showSuccessAlert2 && (
        <div className={`${styles.alert2} ${styles.error2}`}>
          ¡Error al iniciar sesión! El correo y/o la contraseña son incorrectos
        </div>
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
              {/* {errors.correo && (
                <span className={styles.error}>{errors.correo}</span>
              )} */}
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
              {/* {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )} */}
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
    )}
    </div>
  );
}