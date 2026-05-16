import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

/**
 * Componente de barra de navegación
 * Muestra el menú principal y opciones de usuario
 */
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🌱 Invernadero Automatizado
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-item">Dashboard</Link>
          <Link to="/invernadero" className="navbar-item">Invernaderos</Link>
          <Link to="/zona" className="navbar-item">Zonas</Link>
          <Link to="/cultivo" className="navbar-item">Cultivos</Link>
          <Link to="/siembra" className="navbar-item">Siembras</Link>
          <Link to="/sensor" className="navbar-item">Sensores</Link>
          <Link to="/alerta" className="navbar-item">Alertas</Link>
          
          {(user?.rol === 'ADMINISTRADOR' || user?.rol === 'TECNICO') && (
            <>
              <Link to="/riego" className="navbar-item">Riego</Link>
              <Link to="/insumo" className="navbar-item">Insumos</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user?.nombre} {user?.apellido} ({user?.rol})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
