// counterWorker.js

let time = 0; // Tiempo en segundos
let intervalId; // ID del intervalo

self.onmessage = (e) => {
  const { action } = e.data;

  if (action === 'start') {
    // Inicia el conteo
    intervalId = setInterval(() => {
      time += 0.1; // Incrementa el tiempo en 0.1 segundos
      self.postMessage({ time }); // Envía el tiempo actualizado al hilo principal
    }, 100);
  } else if (action === 'stop') {
    // Detiene el conteo
    clearInterval(intervalId);
    self.postMessage({ time, stopped: true }); // Envía el tiempo final y la señal de detención
  }
};
