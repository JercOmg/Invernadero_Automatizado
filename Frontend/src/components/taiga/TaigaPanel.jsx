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
 * en un diseño de panel de vidrio translúcido blanco de alta definición con soporte
 * para creación de historias, tareas y asignaciones rápidas.
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

  // Nuevos estados para miembros e interacción
  const [members, setMembers] = useState([]);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Estados para formularios
  const [newStorySubject, setNewStorySubject] = useState('');
  const [newStoryDescription, setNewStoryDescription] = useState('');
  const [newStoryAssignedTo, setNewStoryAssignedTo] = useState('');
  
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');

  useEffect(() => {
    loadSprint();
    loadMembers();
  }, []);

  const loadSprint = async () => {
    try {
      setLoading(true);
      const data = await taigaService.getSprintActual();
      setSprint(data);
      // Auto-seleccionar la primera historia si existe
      if (data && data.user_stories && data.user_stories.length > 0) {
        handleStoryClick(data.user_stories[0]);
      } else {
        setSelectedStory(null);
        setCriteria(null);
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

  const loadMembers = async () => {
    try {
      const data = await taigaService.getMiembros();
      setMembers(data != null ? data : []);
    } catch (err) {
      console.error('Error cargando miembros:', err);
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

  const handleAssignStory = async (storyId, userId) => {
    try {
      const parsedUserId = userId ? parseInt(userId) : null;
      const updatedStory = await taigaService.asignarHistoria(storyId, parsedUserId);
      
      // Actualizar localmente el listado de historias y el detalle
      if (sprint) {
        const updatedStories = sprint.user_stories.map(story => {
          if (story.id === storyId) {
            return {
              ...story,
              assigned_to: parsedUserId,
              assigned_to_extra_info: updatedStory.assigned_to_extra_info
            };
          }
          return story;
        });
        setSprint({ ...sprint, user_stories: updatedStories });
        setSelectedStory({ 
          ...selectedStory, 
          assigned_to: parsedUserId,
          assigned_to_extra_info: updatedStory.assigned_to_extra_info 
        });
      }
    } catch (err) {
      console.error('Error al asignar historia:', err);
      alert('Error al actualizar la asignación de la historia en Taiga.');
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subject: newStorySubject,
        description: newStoryDescription,
        milestone: sprint ? sprint.id : null,
      };
      if (newStoryAssignedTo) {
        payload.assigned_to = parseInt(newStoryAssignedTo);
      }
      
      await taigaService.crearHistoria(payload);
      
      // Cerrar modal y limpiar campos
      setShowStoryModal(false);
      setNewStorySubject('');
      setNewStoryDescription('');
      setNewStoryAssignedTo('');

      // Recargar sprint
      await loadSprint();
    } catch (err) {
      console.error('Error al crear historia:', err);
      alert('Error al crear la historia de usuario en Taiga.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedStory) return;
    try {
      const payload = {
        subject: newTaskSubject,
        user_story: selectedStory.id,
      };
      if (newTaskAssignedTo) {
        payload.assigned_to = parseInt(newTaskAssignedTo);
      }
      
      await taigaService.crearTarea(payload);
      
      // Cerrar modal y limpiar campos
      setShowTaskModal(false);
      setNewTaskSubject('');
      setNewTaskAssignedTo('');

      // Recargar la historia seleccionada para actualizar su listado de tareas
      await handleStoryClick(selectedStory);
    } catch (err) {
      console.error('Error al crear tarea:', err);
      alert('Error al crear la tarea en Taiga.');
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
        <button 
          onClick={() => setShowStoryModal(true)}
          className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-[1.02]"
        >
          + Crear Nueva Historia (Backlog)
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col taiga-board-container">
      {/* Encabezado del Panel en Modo Claro */}
      <header className="p-6 md:p-8 border-b border-slate-200/60 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              Sprint Activo: <span className="text-emerald-600 font-black">{sprint.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Sincronización en tiempo real con el flujo de trabajo Scrum</p>
          </div>
        </div>
        
        {/* Acciones del encabezado */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-xs">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{sprint.estimated_start} al {sprint.estimated_finish}</span>
          </div>

          <button 
            onClick={() => setShowStoryModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all duration-200"
          >
            + Nueva Historia
          </button>
        </div>
      </header>

      {/* Contenido en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Columna Izquierda: Listado de Historias */}
        <div className="lg:col-span-5 p-6 border-r border-slate-200/60 bg-slate-50/30 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Historias de Usuario ({sprint.user_stories?.length || 0})</h4>
            <span className="text-[10px] bg-white text-slate-500 px-2.5 py-1 rounded-full border border-slate-200/80 font-bold shadow-xs">Sprint backlog</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 taiga-scroll">
            {sprint.user_stories?.map(story => {
              const isSelected = selectedStory?.id === story.id;
              const isClosed = story.is_closed;
              
              return (
                <div 
                  key={story.id} 
                  className={`group w-full p-4 rounded-xl border text-left cursor-pointer story-card-transition flex flex-col space-y-2.5 relative overflow-hidden ${
                    isSelected 
                      ? 'story-card-selected' 
                      : 'bg-white border-slate-200/80 hover:bg-slate-50/50 hover:border-slate-300'
                  }`}
                  onClick={() => handleStoryClick(story)}
                >
                  {/* Decoración lateral en hover o activo */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 transition-transform duration-300 ${
                    isSelected ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-slate-200'
                  }`} />
                  
                  <div className="flex items-start justify-between gap-3 pl-2">
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                      #{story.ref}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      isClosed 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {story.status_extra_info?.name || (isClosed ? 'Cerrada' : 'Abierta')}
                    </span>
                  </div>

                  <p className={`text-sm font-bold leading-snug transition-colors pl-2 break-words ${
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Criterios de Aceptación</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">Historia #{selectedStory.ref}</h4>
                </div>
                
                {/* Selector de Asignación en tiempo real */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Asignado a:</span>
                  <select
                    value={selectedStory.assigned_to || ''}
                    onChange={(e) => handleAssignStory(selectedStory.id, e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs transition-all"
                  >
                    <option value="">Sin Asignar</option>
                    {members.map(member => {
                      const id = member.user || member.user_extended?.id;
                      const name = member.user_extended?.full_name_display || member.user_extended?.username || 'Miembro';
                      return <option key={id} value={id}>{name}</option>;
                    })}
                  </select>
                </div>
              </div>

              {/* Contenido Prose en Modo Claro */}
              <div className="flex-1 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin">
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

              {/* Listado de Tareas asociadas a esta historia */}
              {criteria && (
                <div className="border-t border-slate-200/60 pt-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tareas de desarrollo ({criteria.tasks?.length || 0})</h5>
                    <button 
                      onClick={() => setShowTaskModal(true)}
                      className="text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/80 font-bold flex items-center gap-0.5 transition-colors uppercase tracking-wide border border-emerald-200/60 bg-emerald-50/50 px-2.5 py-1 rounded-lg"
                    >
                      + Agregar Tarea
                    </button>
                  </div>
                  
                  <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 taiga-scroll">
                    {criteria.tasks && criteria.tasks.length > 0 ? (
                      criteria.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-200/50 hover:bg-slate-100/50 transition-all duration-200 text-xs shadow-2xs">
                          <span className="font-semibold text-slate-700 flex-1 min-w-0 break-words pr-2">{task.subject}</span>
                          <span className="text-[10px] bg-white text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200/60 font-extrabold shadow-2xs shrink-0 whitespace-nowrap">
                            {task.assigned_to_extra_info?.full_name_display || 'Sin asignar'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No hay tareas asociadas creadas para esta historia.</p>
                    )}
                  </div>
                </div>
              )}
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

      {/* Modal para Crear Historia */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center taiga-modal-backdrop animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 w-full max-w-md shadow-2xl flex flex-col space-y-4 m-4 taiga-modal-content">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h4 className="text-base font-extrabold text-slate-800">Nueva Historia de Usuario</h4>
              <button onClick={() => setShowStoryModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500">Asunto</label>
                <input 
                  type="text" 
                  required
                  value={newStorySubject}
                  onChange={(e) => setNewStorySubject(e.target.value)}
                  placeholder="Ej: Integrar API de clima externo"
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500">Descripción / Criterios de Aceptación</label>
                <textarea 
                  rows={4}
                  value={newStoryDescription}
                  onChange={(e) => setNewStoryDescription(e.target.value)}
                  placeholder="Define detalladamente los criterios de aceptación de esta especificación..."
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500">Asignar a</label>
                <select
                  value={newStoryAssignedTo}
                  onChange={(e) => setNewStoryAssignedTo(e.target.value)}
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Sin Asignar</option>
                  {members.map(member => {
                    const id = member.user || member.user_extended?.id;
                    const name = member.user_extended?.full_name_display || member.user_extended?.username || 'Miembro';
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowStoryModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-5 py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Crear Historia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Crear Tarea */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center taiga-modal-backdrop animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 w-full max-w-md shadow-2xl flex flex-col space-y-4 m-4 taiga-modal-content">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <h4 className="text-base font-extrabold text-slate-800">Nueva Tarea de Desarrollo</h4>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500">Asunto de la Tarea</label>
                <input 
                  type="text" 
                  required
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  placeholder="Ej: Diseñar el diagrama de clases del servicio"
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/30 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500">Asignar a</label>
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Sin Asignar</option>
                  {members.map(member => {
                    const id = member.user || member.user_extended?.id;
                    const name = member.user_extended?.full_name_display || member.user_extended?.username || 'Miembro';
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-5 py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaigaPanel;
