/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Layout
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio Layout
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

/**
 * Componente de layout principal
 * Envuelve todas las páginas con la barra de navegación
 */
/**
 * Componente Layout
 * @returns {JSX.Element}
 */
const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2026 Sistema de Gestión de Invernadero Automatizado</p>
      </footer>
    </div>
  );
};

export default Layout;
