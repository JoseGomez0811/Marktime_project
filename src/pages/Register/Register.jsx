import React, { useState, useEffect } from "react";
import styles from "./Register.module.css"; // Importa estilos con CSS Modules
import { useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword } from "../../../firebase/auth-service";
import { TRACKING_URL } from "../../constants/urls";
import { toast } from 'react-toastify';
import { insertData } from "../../../firebase/users-service";
import { Loading } from "../../components/Loading/Loading";

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessAlert2, setShowSuccessAlert2] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula una carga de datos
        setTimeout(() => {
        setIsLoading(false);
        }, 3000);
    }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
  
    switch (name) {
      case 'nombres':
        if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
          newErrors.nombres = 'Los nombres solo pueden contener letras y acentos.';
        } else {
          delete newErrors.nombres;
        }
        break;
      case 'apellidos':
        if (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
          newErrors.apellidos = 'Los apellidos solo pueden contener letras y acentos.';
        } else {
          delete newErrors.apellidos;
        }
        break;
        case 'cedula':
          if (!value || /\D/.test(value)) {
            newErrors.cedula = 'La cédula solo puede contener dígitos.';
          } else {
            delete newErrors.cedula;
          }
          break;
      case 'sueldo':
        if (!value || /\D/.test(value)) {
          newErrors.sueldo = 'El sueldo solo puede contener números.';
        } else {
          delete newErrors.sueldo;
        }
        break;
      case 'telefono':
        if (!value || !/^\+?\d+$/.test(value)) {
          newErrors.telefono = 'El número de teléfono solo puede contener dígitos y el signo +.';
        } else {
          delete newErrors.telefono;
        }
        break;
        case 'cuenta':
          if (!value || /\D/.test(value)) {
            newErrors.cuenta = 'El número de cuenta solo puede contener dígitos.';
          } else {
            delete newErrors.cuenta;
          }
          break;
      case 'correo':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors.correo = 'El correo electrónico no es válido.';
        } else {
          delete newErrors.correo;
        }
        break;
        case 'password':
          if (!value || value.length < 8 || !/[A-Z]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.';
          } else {
            delete newErrors.password;
          }
          break;
      default:
        break;
    }
  
    setErrors(newErrors);
  };
  
  const validate = () => {
    const newErrors = {};
  
    if (!formData.nombres || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = 'Los nombres solo pueden contener letras y acentos.';
    }
    if (!formData.apellidos || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos solo pueden contener letras y acentos.';
    }
    if (!formData.cedula || !/^\d+$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula solo puede contener números.';
    }
    if (!formData.sueldo || /\D/.test(formData.sueldo)) {
      newErrors.sueldo = 'El sueldo solo puede contener números.';
    }
    if (!formData.telefono || !/^\+?\d+$/.test(formData.telefono)) {
      newErrors.telefono = 'El número de teléfono solo puede contener dígitos y el signo +.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = 'El correo electrónico no es válido.';
    }
    if (!formData.password || formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const onSuccess = () => {
    setShowSuccessAlert(true);

    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);

    //navigate(REGISTER_URL);
  };

  const onFail = (_error) => {
    setShowSuccessAlert2(true);

    setTimeout(() => {
      setShowSuccessAlert2(false);
    }, 2000);

    //console.log("REGISTER FAILED, Try Again");
    notifyError("REGISTER FAILED, Try Again");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validate()) {
        const result = await registerWithEmailAndPassword(formData.correo, formData.password);

        await insertData(formData);
        //alert("Registro exitoso");

        onSuccess();

      } else {
        console.log("Ocurrio un error desconocido");
        onFail();
      }

    } catch (error) {
      console.error("Error al registrar los datos: ", error);
      //alert("Error al registrar los datos");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Validar el campo actual
    validateField(name, value);
  };

  return (
    <div>
            {isLoading && <Loading />}
            {!isLoading && (
    <div className={styles.root}>

      {showSuccessAlert && (
        <div className={`${styles.alert} ${styles.success2}`}>
          ¡Se registró exitosamente!
        </div>
      )}

      {showSuccessAlert2 && (
        <div className={`${styles.alert2} ${styles.error2}`}>
          ¡Error al registrar un nuevo usuario!
        </div>
      )}

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
              {errors.cedula && <span className={styles.error}>{errors.cedula}</span>}
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
              {errors.sueldo && <span className={styles.error}>{errors.sueldo}</span>}
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
          <div className={styles.containerButton}>
            <button type="submit" className={styles.submitBtn}>Registrar</button>
          </div>
        </form>
      </div>
    </div>
    )}
    </div>
  );
}
