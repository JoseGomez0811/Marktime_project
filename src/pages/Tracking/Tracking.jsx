import React, { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Tracking.module.css";
import { auth } from "../../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  addTimeRecordToBDD,
  getUserSalaryByEmail,
  getHoursRecords
} from "../../../firebase/users-service";

export function Tracking() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [records, setRecords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [filter, setFilter] = useState({ type: "all", date: new Date() });
  const [userEmail, setUserEmail] = useState("");
  const [userSalary, setUserSalary] = useState(null);
  const [hourRecords, setHourRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserContext();

  // Firebase auth effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        try {
          const salary = await getUserSalaryByEmail(user.email);
          setUserSalary(salary);
        } catch (error) {
          console.error("Error al obtener el sueldo del usuario:", error);
        }
      } else {
        setUserEmail("");
        setUserSalary(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  // Fetch records effect
  useEffect(() => {
    const fetchRecords = async () => {
      if (user?.Cédula) {
        try {
          setIsLoading(true);
          const records = await getHoursRecords(user.Cédula);
          const validRecords = records.filter(record => {
            const hasValidStartTime = record.startTime && !isNaN(new Date(record.startTime));
            const hasValidEndTime = record.endTime && !isNaN(new Date(record.endTime));
            const hasValidHoras = typeof record.horas === 'number';
            return hasValidStartTime && hasValidEndTime && hasValidHoras;
          });
          setHourRecords(validRecords);
        } catch (error) {
          console.error("Error al obtener los registros de horas:", error);
          setHourRecords([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setHourRecords([]);
      }
    };

    fetchRecords();
  }, [user]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    if (startTime) {
        setIsRunning(false);
        const endTime = new Date();
        const duration = Number(((endTime.getTime() - startTime.getTime()) / 1000).toFixed(1));

        // Crea el nuevo registro
        const newRecord = {
            id: hourRecords.length + 1, // Asegúrate de que el ID sea único
            startTime: startTime,
            endTime: endTime,
            horas: duration,
        };

        // Actualiza el estado de hourRecords y también los records
        setHourRecords((prevRecords) => [...prevRecords, newRecord]);
        setRecords((prevRecords) => [
            ...prevRecords,
            {
                id: prevRecords.length + 1,
                start: startTime,
                end: endTime,
                duration: duration,
            },
        ]);

        // Agrega el registro a la base de datos
        addTimeRecordToBDD(userEmail, startTime, endTime, duration);
        setTime(0);
        setStartTime(null);
    }
};

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time * 10) % 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds}`;
  };

  const formatDate = (date) => {
    try {
      if (!date) return 'Fecha no disponible';
      
      if (date?.toDate) {
        date = date.toDate();
      }
      
      if (typeof date === 'string') {
        date = new Date(date);
      }
      
      if (date instanceof Date && !isNaN(date)) {
        return format(date, "dd/MM/yyyy HH:mm:ss", { locale: es });
      }
      
      return 'Fecha inválida';
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  };

  const filterRecords = (records) => {
    if (!records || records.length === 0) return [];
    
    const getDateFromTimestamp = (timestamp) => {
      if (!timestamp) return null;
      if (timestamp?.toDate) {
        return timestamp.toDate();
      }
      if (typeof timestamp === 'string') {
        return new Date(timestamp);
      }
      if (timestamp instanceof Date) {
        return timestamp;
      }
      return null;
    };

    return records.filter(record => {
      const recordStart = getDateFromTimestamp(record.startTime);
      if (!recordStart) return false;

      switch (filter.type) {
        case "day": {
          const filterDate = filter.date;
          return (
            recordStart.getFullYear() === filterDate.getFullYear() &&
            recordStart.getMonth() === filterDate.getMonth() &&
            recordStart.getDate() === filterDate.getDate()
          );
        }
        case "week": {
          const weekStart = startOfWeek(filter.date, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(filter.date, { weekStartsOn: 1 });
          return isWithinInterval(recordStart, { start: weekStart, end: weekEnd });
        }
        case "month": {
          const monthStart = startOfMonth(filter.date);
          const monthEnd = endOfMonth(filter.date);
          return isWithinInterval(recordStart, { start: monthStart, end: monthEnd });
        }
        case "year": {
          const yearStart = startOfYear(filter.date);
          const yearEnd = endOfYear(filter.date);
          return isWithinInterval(recordStart, { start: yearStart, end: yearEnd });
        }
        default:
          return true;
      }
    });
  };

  // Calculate filtered records inside the render
  const filteredHourRecords = filterRecords(hourRecords);
  const totalTime = records.reduce((acc, record) => acc + record.duration, 0);
  const hourlyRate = userSalary / 3600;
  const totalSalary = totalTime * hourlyRate;

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <h1>Sistema de Control de Tiempo</h1>
        </header>

        <div className={styles.grid}>
          <div className={styles.timerCard}>
            <div className="text-center">
              <h2 className={styles.timerTitle}>Contador</h2>
              <div className={styles.timer}>{formatTime(time)}</div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.startButton}
                  onClick={handleStart}
                  disabled={isRunning}
                >
                  Iniciar
                </button>
                <button
                  className={styles.stopButton}
                  onClick={handleStop}
                  disabled={!isRunning}
                >
                  Detener
                </button>
              </div>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsTitleWrapper}>
              <h2 className={styles.statsTitle}>Estadísticas</h2>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <p>Tiempo Total Acumulado</p>
                <p>{formatTime(totalTime)}</p>
              </div>
              <div className={styles.statItem}>
                <p>Salario acumulado</p>
                <p>{totalSalary.toFixed(1)}$</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recordsCard}>
          <div className={styles.recordsHeader}>
            <h2>Registro de Tiempos</h2>
            <div className={styles.filterGroup}>
              <select
                className={styles.filterSelect}
                value={filter.type}
                onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">Todos los registros</option>
                <option value="day">Por día</option>
                <option value="week">Por semana</option>
                <option value="month">Por mes</option>
                <option value="year">Por año</option>
              </select>
              {filter.type !== "all" && (
                <DatePicker
                  selected={filter.date}
                  onChange={(date) => date && setFilter((prev) => ({ ...prev, date }))}
                  dateFormat="dd/MM/yyyy"
                  className={styles.datePicker}
                  locale={es}
                />
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center">Cargando registros...</td>
                  </tr>
                ) : filteredHourRecords.length > 0 ? (
                  filteredHourRecords.map((record, index) => (
                    <tr key={record.id || index}>
                      <td>{record.id || index + 1}</td>
                      <td>{formatDate(record.startTime)}</td>
                      <td>{formatDate(record.endTime)}</td>
                      <td>{typeof record.horas === 'number' ? formatTime(record.horas) : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay registros disponibles para el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}