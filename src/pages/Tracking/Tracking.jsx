import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './Tracking.module.css';

export function Tracking() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [records, setRecords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', date: new Date() });

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

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    if (startTime) {
      setIsRunning(false);
      const endTime = new Date();
      const duration = Number(((endTime.getTime() - startTime.getTime()) / 1000).toFixed(1));
      setRecords((prevRecords) => [
        ...prevRecords,
        {
          id: prevRecords.length + 1,
          start: startTime,
          end: endTime,
          duration: duration
        }
      ]);
      setTime(0);
      setStartTime(null);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time * 10) % 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: es });
  };

  const filterRecords = (records, filter) => {
    switch (filter.type) {
      case 'day':
        return records.filter(record =>
          record.start.toDateString() === filter.date.toDateString()
        );
      case 'week': {
        const weekStart = startOfWeek(filter.date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(filter.date, { weekStartsOn: 1 });
        return records.filter(record =>
          isWithinInterval(record.start, { start: weekStart, end: weekEnd })
        );
      }
      case 'month': {
        const monthStart = startOfMonth(filter.date);
        const monthEnd = endOfMonth(filter.date);
        return records.filter(record =>
          isWithinInterval(record.start, { start: monthStart, end: monthEnd })
        );
      }
      case 'year': {
        const yearStart = startOfYear(filter.date);
        const yearEnd = endOfYear(filter.date);
        return records.filter(record =>
          isWithinInterval(record.start, { start: yearStart, end: yearEnd })
        );
      }
      default:
        return records;
    }
  };

  const filteredRecords = filterRecords(records, filter);
  const totalUses = records.length;
  const totalTime = records.reduce((acc, record) => acc + record.duration, 0);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <h1>Sistema de Control de Tiempo</h1>
          <p>Gestione y registre el tiempo de sus actividades de manera eficiente.</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.timerCard}>
            <h2>Contador</h2>
            <div className="text-center">
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
            <h2>Estadísticas</h2>
            <div className={styles.statsGrid}>
              <div>
                <p>Número de Usos</p>
                <p>{totalUses}</p>
              </div>
              <div>
                <p>Tiempo Total Acumulado</p>
                <p>{formatTime(totalTime)}</p>
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
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">Todos los registros</option>
                <option value="day">Por día</option>
                <option value="week">Por semana</option>
                <option value="month">Por mes</option>
                <option value="year">Por año</option>
              </select>
              {filter.type !== 'all' && (
                <DatePicker
                  selected={filter.date}
                  onChange={(date) => date && setFilter(prev => ({ ...prev, date }))}
                  dateFormat="dd/MM/yyyy"
                  className={styles.datePicker}
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
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{formatDate(record.start)}</td>
                    <td>{formatDate(record.end)}</td>
                    <td>{formatTime(record.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
