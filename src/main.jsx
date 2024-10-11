import React from 'react';
import ReactDOM from "react-dom/client";
import RegistroUsuario from './pages/Register/Register';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TRACKING_URL } from "../src/constants/urls"; // Asegúrate de que esta constante esté bien definida
import { Tracking } from "../src/pages/Tracking/Tracking";
import { Navigate } from "react-router-dom";
import Login from './pages/Login/Login';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to={TRACKING_URL} />} />
    <Route path={TRACKING_URL} element={<Tracking />} />
    <Route path="/" element={<Navigate to="/registro" />} />
      <Route path="/registro" element={<RegistroUsuario />} />
    </Routes>
  </BrowserRouter>
);

