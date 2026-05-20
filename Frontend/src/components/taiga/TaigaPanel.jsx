/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: TaigaPanel
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente para mostrar el Sprint Actual desde Taiga, rediseñado para un Modo Claro Premium usando Tailwind CSS v4.
 */
import React, { useState, useEffect } from 'react';
import taigaService from '../../services/taigaService';
import './TaigaPanel.css';

/**
 * Componente TaigaPanel
 * Muestra las historias de usuario y criterios de aceptación del Sprint activo
 * en un diseño de panel de vidrio translúcido blanco de alta definición.
 * 
 * @returns {JSX.Element}
 */
const TaigaPanel = () => {
  const [sprint, setSprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [loadingCriteria, setLoadingCriteria] = useState(false);

  useEffect(() => {
    loadSprint();
  }, []);

  const loadSprint = async () => {
    try {
      setLoading(true);
      const data = await taigaService.getSprintActual();
      setSprint(data);
      // Auto-seleccionar la primera historia si existe
      if (data && data.user_stories && data.user_stories.length > 0) {
        handleStoryClick(data.user_stories[0]);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setSprint(null);
      } else {
        console.error(err);
        setError('No se pudo establecer conexión con el sprint activo en Taiga.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (story) => {
    setSelectedStory(story);
    setCriteria(null);
    setLoadingCriteria(true);
    try {
      const data = await taigaService.getCriteriosHistoria(story.id);
      setCriteria(data);
    } catch (err) {
      console.error('Error cargando criterios:', err);
      setCriteria({ description: 'No se pudieron recuperar los criterios de aceptación para esta historia.' });
    } finally {
      setLoadingCriteria(false);
    }
  };

  // Render para el estado de carga inicial en Modo Claro
  if (loading) {
    return (
      <div className="w-full rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-pulse">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-100 border-t-emerald-500 animate-spin"></div>
        <p className="text-slate-500 text-sm font-semibold tracking-wider">Sincronizando con Taiga Agile...</p>
      </div>
    );
  }

  // Render para estado de error
  if (error) {
    return (
      <div className="w-full rounded-3xl border border-rose-200/60 bg-rose-50/50 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] shadow-sm">
        <span className="text-4xl">⚠️</span>
        <h4 className="text-lg font-bold text-rose-600">Error de Conexión</h4>
        <p className="text-slate-500 text-sm max-w-md leading-relaxed">{error}</p>
      </div>
    );
  }

  // Render para cuando no hay Sprint activo
  if (!sprint) {
    return (
      <div className="w-full rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] shadow-sm">
        <span className="text-3xl">📭</span>
        <h4 className="text-lg font-bold text-slate-700">Planificación del Sprint</h4>
        <p className="text-slate-500 text-sm max-w-md leading-relaxed">No hay un sprint activo programado actualmente en el tablero de Taiga.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
      {/* Encabezado del Panel en Modo Claro */}
      <header className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              Sprint Activo: <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{sprint.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Sincronización en tiempo real con el flujo de trabajo Scrum</p>
          </div>
        </div>
        
        {/* Rango de fechas */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-slate-200/60 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{sprint.estimated_start} al {sprint.estimated_finish}</span>
        </div>
      </header>

      {/* Contenido en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
        {/* Columna Izquierda: Listado de Historias */}
        <div className="lg:col-span-5 p-6 border-r border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Historias de Usuario ({sprint.user_stories?.length || 0})</h4>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200/30 font-bold">Backlog</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1 scrollbar-thin">
            {sprint.user_stories?.map(story => {
              const isSelected = selectedStory?.id === story.id;
              const isClosed = story.is_closed;
              
              return (
                <div 
                  key={story.id} 
                  className={`group w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex flex-col space-y-2.5 relative overflow-hidden ${
                    isSelected 
                      ? 'bg-emerald-500/5 border-emerald-300/80 shadow-[0_4px_12px_rgba(16,185,129,0.05)]' 
                      : 'bg-slate-50/40 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/60'
                  }`}
                  onClick={() => handleStoryClick(story)}
                >
                  {/* Decoración lateral en hover o activo */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 transition-transform duration-300 ${
                    isSelected ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-slate-200'
                  }`} />
                  
                  <div className="flex items-start justify-between gap-3 pl-1">
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200/30">
                      #{story.ref}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      isClosed 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200/40' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {story.status_extra_info?.name || (isClosed ? 'Cerrada' : 'Abierta')}
                    </span>
                  </div>

                  <p className={`text-sm font-bold leading-snug transition-colors pl-1 ${
                    isSelected ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                  }`}>
                    {story.subject}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle de Criterios de Aceptación */}
        <div className="lg:col-span-7 p-6 bg-slate-50/10 flex flex-col space-y-4">
          {selectedStory ? (
            <div className="flex flex-col h-full space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Criterios de Aceptación</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">Historia #{selectedStory.ref}</h4>
                </div>
                <span className="text-xs text-slate-400 font-bold truncate max-w-[200px]">{selectedStory.subject}</span>
              </div>

              {/* Contenido Prose en Modo Claro */}
              <div className="flex-1 overflow-y-auto max-h-[330px] pr-2 scrollbar-thin">
                {loadingCriteria ? (
                  <div className="flex flex-col items-center justify-center space-y-3 py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-100 border-t-emerald-500 animate-spin"></div>
                    <span className="text-xs text-slate-500 font-semibold">Recuperando especificaciones...</span>
                  </div>
                ) : criteria ? (
                  <div 
                    className="prose prose-slate prose-emerald text-sm text-slate-600 space-y-3 leading-relaxed break-words"
                    dangerouslySetInnerHTML={{ __html: criteria.description || '<p className="text-slate-400 italic">No se han definido criterios detallados para esta historia en Taiga.</p>' }}
                  />
                ) : (
                  <p className="text-slate-400 italic text-sm">Criterios no disponibles.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full py-16 space-y-2">
              <span className="text-4xl text-slate-300">👈</span>
              <h5 className="text-sm font-bold text-slate-500">Sin Selección</h5>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">Selecciona una historia del listado izquierdo para inspeccionar sus especificaciones técnicas y criterios de aceptación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaigaPanel;
