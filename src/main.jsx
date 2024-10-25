import React from 'react';
import ReactDOM from "react-dom/client";
//import RegistroUsuario from './pages/Register/Register';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { TRACKING_URL, REGISTER_URL, LOGIN_URL, PROFILE_URL, LIST_URL } from "../src/constants/urls"; // Asegúrate de que esta constante esté bien definida
import { Login } from "../src/pages/Login/Login";
import { RegistroUsuario } from "../src/pages/Register/Register";
import { Tracking } from "../src/pages/Tracking/Tracking";
import { Navigate } from "react-router-dom";
//import Login from './pages/Login/Login';
import { Layout } from './pages/Layout/Layout';
import { UserContextProvider } from './contexts/UserContext';
import ProfileEmployee from './pages/Profiles/ProfileEmployee';
import UserList from './pages/EmployeeList/EmployeeList';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <Routes>

        <Route path="/" element={<Navigate to={LOGIN_URL} />} />
        <Route path={LOGIN_URL} element={<Login />} />

        <Route path="/" element={<Navigate to={REGISTER_URL} />} />
        <Route path={REGISTER_URL} element={<RegistroUsuario />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={TRACKING_URL} />} />
          <Route path={TRACKING_URL} element={<Tracking />} />
          <Route path="/" element={<Navigate to={PROFILE_URL} />} />
          <Route path={PROFILE_URL} element={<ProfileEmployee />} />
          <Route path="/" element={<Navigate to={LIST_URL} />} />
          <Route path={LIST_URL} element={<UserList />} />
        </Route>

      </Routes>
    </UserContextProvider>
      
  </BrowserRouter>
);

