/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: TaigaPanel
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente para mostrar el Sprint Actual desde Taiga
 */
import React, { useState, useEffect } from 'react';
import taigaService from '../../services/taigaService';
import './TaigaPanel.css';

const TaigaPanel = () => {
  const [sprint, setSprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [criteria, setCriteria] = useState(null);

  useEffect(() => {
    loadSprint();
  }, []);

  const loadSprint = async () => {
    try {
      setLoading(true);
      const data = await taigaService.getSprintActual();
      setSprint(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el sprint activo o no se han configurado las credenciales de Taiga.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (story) => {
    setSelectedStory(story);
    setCriteria(null);
    try {
      const data = await taigaService.getCriteriosHistoria(story.id);
      setCriteria(data);
    } catch (err) {
      console.error('Error cargando criterios:', err);
    }
  };

  if (loading) return <div className="taiga-loading">Cargando sprint de Taiga...</div>;
  if (error) return <div className="taiga-error">{error}</div>;
  if (!sprint) return <div className="taiga-empty">No hay sprint activo.</div>;

  return (
    <div className="taiga-panel">
      <div className="taiga-header">
        <h3>📊 Sprint Activo: {sprint.name}</h3>
        <span className="taiga-dates">
          {sprint.estimated_start} - {sprint.estimated_finish}
        </span>
      </div>

      <div className="taiga-content">
        <div className="taiga-stories">
          <h4>Historias de Usuario ({sprint.user_stories?.length || 0})</h4>
          <ul className="story-list">
            {sprint.user_stories?.map(story => (
              <li 
                key={story.id} 
                className={`story-item ${selectedStory?.id === story.id ? 'active' : ''} ${story.is_closed ? 'closed' : 'open'}`}
                onClick={() => handleStoryClick(story)}
              >
                <span className="story-ref">#{story.ref}</span>
                <span className="story-subject">{story.subject}</span>
                <span className="story-status">{story.status_extra_info?.name || 'Abierta'}</span>
              </li>
            ))}
          </ul>
        </div>

        {selectedStory && (
          <div className="taiga-criteria">
            <h4>Criterios de Aceptación (Historia #{selectedStory.ref})</h4>
            {criteria ? (
              <div className="criteria-content" dangerouslySetInnerHTML={{ __html: criteria.description || 'Sin descripción' }} />
            ) : (
              <div className="taiga-loading">Cargando detalles...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaigaPanel;
