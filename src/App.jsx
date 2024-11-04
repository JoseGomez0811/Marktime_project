import React from 'react';
import { useState } from 'react';
import { UserContextProvider } from './UserContext'; // Asegúrate de que la ruta sea correcta
import ProfileComponent from './ProfileComponent'; // Asegúrate de que la ruta sea correcta
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <UserContextProvider>
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>

        {/* Agregar el componente de perfil */}
        <h1>Gestión de Perfil de Usuario</h1>
        <ProfileComponent />
      </>
    </UserContextProvider>
  );
}

export default App;
