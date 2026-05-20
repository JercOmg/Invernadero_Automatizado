/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Dashboard
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio Dashboard rediseñado para un Modo Claro Premium impecable usando Tailwind CSS v4.
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import TaigaPanel from '../../components/taiga/TaigaPanel';
import './Dashboard.css';

/**
 * Componente Dashboard
 * Presenta un centro de control premium optimizado para modo claro, con glassmorphism blanco,
 * gradientes naturales limpios, micro-interacciones fluidas y el panel Scrum.
 * 
 * @returns {JSX.Element}
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Módulos con iconos, claves de traducción y enlaces correspondientes.
  const modules = [
    { id: 'invernaderos', icon: '🏠', titleKey: 'menu.invernaderos', descKey: 'dashboard.descInvernaderos', link: '/invernadero', color: 'from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/20' },
    { id: 'zonas', icon: '📍', titleKey: 'menu.zonas', descKey: 'dashboard.descZonas', link: '/zona', color: 'from-teal-500/5 to-cyan-500/5 hover:border-teal-500/20' },
    { id: 'cultivos', icon: '🌾', titleKey: 'menu.cultivos', descKey: 'dashboard.descCultivos', link: '/cultivo', color: 'from-green-500/5 to-emerald-500/5 hover:border-green-500/20' },
    { id: 'siembras', icon: '🌱', titleKey: 'menu.siembras', descKey: 'dashboard.descSiembras', link: '/siembra', color: 'from-lime-500/5 to-green-500/5 hover:border-lime-500/20' },
    { id: 'sensores', icon: '📡', titleKey: 'menu.sensores', descKey: 'dashboard.descSensores', link: '/sensor', color: 'from-cyan-500/5 to-blue-500/5 hover:border-cyan-500/20' },
    { id: 'lecturas', icon: '📊', titleKey: 'dashboard.titleLecturas', descKey: 'dashboard.descLecturas', link: '/lectura_sensor', color: 'from-sky-500/5 to-indigo-500/5 hover:border-sky-500/20' },
    { id: 'riego', icon: '💧', titleKey: 'menu.riego', descKey: 'dashboard.descRiego', link: '/riego', color: 'from-blue-500/5 to-indigo-500/5 hover:border-blue-500/20' },
    { id: 'alertas', icon: '⚠️', titleKey: 'menu.alertas', descKey: 'dashboard.descAlertas', link: '/alerta', color: 'from-amber-500/5 to-orange-500/5 hover:border-amber-500/20' },
    { id: 'insumos', icon: '🧪', titleKey: 'menu.insumos', descKey: 'dashboard.descInsumos', link: '/insumo', color: 'from-indigo-500/5 to-purple-500/5 hover:border-indigo-500/20' },
    { id: 'aplicaciones', icon: '💉', titleKey: 'dashboard.titleAplicaciones', descKey: 'dashboard.descAplicaciones', link: '/aplicacion_insumo', color: 'from-purple-500/5 to-fuchsia-500/5 hover:border-purple-500/20' },
    { id: 'cosechas', icon: '🌽', titleKey: 'dashboard.titleCosechas', descKey: 'dashboard.descCosechas', link: '/cosecha', color: 'from-rose-500/5 to-amber-500/5 hover:border-rose-500/20' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-fade-in">
      {/* Cabecera del Centro de Control en Modo Claro Premium */}
      <header className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-3 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 bg-clip-text text-transparent">
            {t('dashboard.welcome')}, {user?.nombre} {user?.apellido}
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl font-medium">
            Monitoreo inteligente, analíticas predictivas y automatización integral para tu cultivo agroecológico.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{t('dashboard.role')}: {user?.rol || 'OPERARIO'}</span>
          </div>
        </div>
      </header>

      {/* Sección del Sprint Panel (Taiga) */}
      <section className="relative z-10">
        <TaigaPanel />
      </section>

      {/* Grid de Módulos Operacionales */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-6 rounded bg-gradient-to-b from-emerald-500 to-teal-700"></span>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800">Módulos del Sistema</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${mod.color} hover:bg-white/90 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] flex flex-col justify-between min-h-[220px]`}
            >
              <div>
                {/* Icono con resplandor en modo claro */}
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/40 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:border-emerald-500/20 group-hover:bg-emerald-50 transition-all duration-300 shadow-sm">
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">{mod.icon}</span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                  {t(mod.titleKey)}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-slate-500 mt-2 line-clamp-3 font-semibold leading-relaxed">
                  {t(mod.descKey)}
                </p>
              </div>

              {/* Botón de Enlace */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a 
                  href={mod.link} 
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
                >
                  <span>{t('dashboard.viewInvernaderos') || 'Gestionar'}</span>
                  <svg 
                    className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
