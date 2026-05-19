import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

/**
 * Página principal del dashboard
 * Muestra un resumen del sistema de invernadero
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.welcome')}, {user?.nombre} {user?.apellido}</h1>
        <p className="user-role">{t('dashboard.role')}: {user?.rol}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🏠</div>
          <h3>{t('menu.invernaderos')}</h3>
          <p>{t('dashboard.descInvernaderos')}</p>
          <a href="/invernadero" className="card-link">{t('dashboard.viewInvernaderos')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📍</div>
          <h3>{t('menu.zonas')}</h3>
          <p>{t('dashboard.descZonas')}</p>
          <a href="/zona" className="card-link">{t('dashboard.viewZonas')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌾</div>
          <h3>{t('menu.cultivos')}</h3>
          <p>{t('dashboard.descCultivos')}</p>
          <a href="/cultivo" className="card-link">{t('dashboard.viewCultivos')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌱</div>
          <h3>{t('menu.siembras')}</h3>
          <p>{t('dashboard.descSiembras')}</p>
          <a href="/siembra" className="card-link">{t('dashboard.viewSiembras')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📡</div>
          <h3>{t('menu.sensores')}</h3>
          <p>{t('dashboard.descSensores')}</p>
          <a href="/sensor" className="card-link">{t('dashboard.viewSensores')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>{t('dashboard.titleLecturas')}</h3>
          <p>{t('dashboard.descLecturas')}</p>
          <a href="/lectura_sensor" className="card-link">{t('dashboard.viewLecturas')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💧</div>
          <h3>{t('menu.riego')}</h3>
          <p>{t('dashboard.descRiego')}</p>
          <a href="/riego" className="card-link">{t('dashboard.viewRiego')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚠️</div>
          <h3>{t('menu.alertas')}</h3>
          <p>{t('dashboard.descAlertas')}</p>
          <a href="/alerta" className="card-link">{t('dashboard.viewAlertas')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🧪</div>
          <h3>{t('menu.insumos')}</h3>
          <p>{t('dashboard.descInsumos')}</p>
          <a href="/insumo" className="card-link">{t('dashboard.viewInsumos')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💉</div>
          <h3>{t('dashboard.titleAplicaciones')}</h3>
          <p>{t('dashboard.descAplicaciones')}</p>
          <a href="/aplicacion_insumo" className="card-link">{t('dashboard.viewAplicaciones')}</a>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🌽</div>
          <h3>{t('dashboard.titleCosechas')}</h3>
          <p>{t('dashboard.descCosechas')}</p>
          <a href="/cosecha" className="card-link">{t('dashboard.viewCosechas')}</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
