import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

/**
 * Página principal del dashboard
 * Muestra un resumen del sistema de invernadero
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombre} {user?.apellido}</h1>
        <p className="user-role">Rol: {user?.rol}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🏠</div>
          <h3>Invernaderos</h3>
          <p>Gestiona las instalaciones físicas de invernadero</p>
          <a href="/invernadero" className="card-link">Ver Invernaderos →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📍</div>
          <h3>Zonas</h3>
          <p>Administra las zonas dentro de cada invernadero</p>
          <a href="/zona" className="card-link">Ver Zonas →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌾</div>
          <h3>Cultivos</h3>
          <p>Catálogo de especies y variedades cultivadas</p>
          <a href="/cultivo" className="card-link">Ver Cultivos →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌱</div>
          <h3>Siembras</h3>
          <p>Registro de eventos de siembra realizados</p>
          <a href="/siembra" className="card-link">Ver Siembras →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📡</div>
          <h3>Sensores</h3>
          <p>Dispositivos de medición instalados</p>
          <a href="/sensor" className="card-link">Ver Sensores →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Lecturas</h3>
          <p>Serie temporal de mediciones de sensores</p>
          <a href="/lectura_sensor" className="card-link">Ver Lecturas →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💧</div>
          <h3>Riego</h3>
          <p>Eventos de riego automáticos y manuales</p>
          <a href="/riego" className="card-link">Ver Riego →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚠️</div>
          <h3>Alertas</h3>
          <p>Notificaciones de condiciones anómalas</p>
          <a href="/alerta" className="card-link">Ver Alertas →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🧪</div>
          <h3>Insumos</h3>
          <p>Inventario de fertilizantes y pesticidas</p>
          <a href="/insumo" className="card-link">Ver Insumos →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💉</div>
          <h3>Aplicaciones</h3>
          <p>Historial de aplicación de insumos</p>
          <a href="/aplicacion_insumo" className="card-link">Ver Aplicaciones →</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌽</div>
          <h3>Cosechas</h3>
          <p>Registro de producción cosechada</p>
          <a href="/cosecha" className="card-link">Ver Cosechas →</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
