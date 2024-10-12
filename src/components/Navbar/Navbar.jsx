import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Users, UserPlus, Activity } from 'lucide-react';

const Sidebar = ({ user }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.svg" alt="Logo de la empresa" className="company-logo" />
        <h1 className="company-name">Nombre Empresa</h1>
      </div>
      
      <div className="user-info">
        <img src={user.profilePicture} alt={user.name} className="user-avatar" />
        <span className="user-name">{user.name}</span>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/profile" className="nav-item">
          <User size={20} />
          <span>Perfil</span>
        </Link>
        
        {user.type === 'A' && (
          <Link to="/tracking" className="nav-item">
            <Activity size={20} />
            <span>Tracking</span>
          </Link>
        )}
        
        {(user.type === 'B' || user.type === 'C') && (
          <Link to="/employees" className="nav-item">
            <Users size={20} />
            <span>Listado de Empleados</span>
          </Link>
        )}
        
        {user.type === 'C' && (
          <Link to="/register-employee" className="nav-item">
            <UserPlus size={20} />
            <span>Registrar Empleado</span>
          </Link>
        )}
      </nav>
      
      <button className="logout-button">
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
};

export default Sidebar;