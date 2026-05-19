import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../common/LanguageSelector';
import './Navbar.css';

/**
 * Componente de barra de navegación
 * Muestra el menú principal y opciones de usuario
 */
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <Link to="/dashboard" className="navbar-item">{t('menu.dashboard')}</Link>
          <Link to="/invernadero" className="navbar-item">{t('menu.invernaderos')}</Link>
          <Link to="/zona" className="navbar-item">{t('menu.zonas')}</Link>
          <Link to="/cultivo" className="navbar-item">{t('menu.cultivos')}</Link>
          <Link to="/siembra" className="navbar-item">{t('menu.siembras')}</Link>
          <Link to="/sensor" className="navbar-item">{t('menu.sensores')}</Link>
          <Link to="/alerta" className="navbar-item">{t('menu.alertas')}</Link>
          
          {(user?.rol === 'ADMINISTRADOR' || user?.rol === 'TECNICO') && (
            <>
              <Link to="/riego" className="navbar-item">{t('menu.riego')}</Link>
              <Link to="/insumo" className="navbar-item">{t('menu.insumos')}</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <LanguageSelector />
          <span className="user-info" style={{ marginLeft: '1rem' }}>
            {user?.nombre} {user?.apellido} ({user?.rol})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            {t('menu.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
