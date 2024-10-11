import React from 'react';
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TRACKING_URL } from "../src/constants/urls"; // Asegúrate de que esta constante esté bien definida
import { Tracking } from "../src/pages/Tracking/Tracking";
import { Navigate } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={TRACKING_URL} />} /> {/* Redirigir a Tracking */}
      <Route path={TRACKING_URL} element={<Tracking />} />
    </Routes>
  </BrowserRouter>
);

