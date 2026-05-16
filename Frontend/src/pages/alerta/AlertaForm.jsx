import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import alertaService from '../../services/alertaService';
import './AlertaForm.css';

/**
 * Componente para crear/editar Alerta
 */
const AlertaForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await alertaService.getById(id);
      setFormData(data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await alertaService.update(id, formData);
      } else {
        await alertaService.create(formData);
      }
      navigate('/alerta');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>{isEdit ? 'Editar' : 'Crear'} Alerta</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idSensor">Id Sensor</label>
            <input
              type="number"
              id="idSensor"
              name="idSensor"
              value={formData.idSensor || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="idZona">Id Zona</label>
            <input
              type="number"
              id="idZona"
              name="idZona"
              value={formData.idZona || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="tipoAlerta">Tipo Alerta</label>
            <select
              id="tipoAlerta"
              name="tipoAlerta"
              value={formData.tipoAlerta || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="TEMPERATURA_ALTA">TEMPERATURA_ALTA</option>\n              <option value="TEMPERATURA_BAJA">TEMPERATURA_BAJA</option>\n              <option value="HUMEDAD_ALTA">HUMEDAD_ALTA</option>\n              <option value="HUMEDAD_BAJA">HUMEDAD_BAJA</option>\n              <option value="CO2_ALTO">CO2_ALTO</option>\n              <option value="PH_FUERA_RANGO">PH_FUERA_RANGO</option>\n              <option value="FALLA_SENSOR">FALLA_SENSOR</option>\n              <option value="PLAGA_ENFERMEDAD">PLAGA_ENFERMEDAD</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="fechaHora">Fecha Hora</label>
            <input
              type="datetime-local"
              id="fechaHora"
              name="fechaHora"
              value={formData.fechaHora || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="nivel">Nivel</label>
            <select
              id="nivel"
              name="nivel"
              value={formData.nivel || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="INFORMATIVA">INFORMATIVA</option>\n              <option value="ADVERTENCIA">ADVERTENCIA</option>\n              <option value="CRITICA">CRITICA</option>
            </select>
          </div>\n\n          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="resuelta"
                checked={formData.resuelta || false}
                onChange={handleChange}
              />
              Resuelta
            </label>
          </div>\n\n          <div className="form-group">
            <label htmlFor="fechaResolucion">Fecha Resolucion</label>
            <input
              type="datetime-local"
              id="fechaResolucion"
              name="fechaResolucion"
              value={formData.fechaResolucion || ''}
              onChange={handleChange}
              
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/alerta')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertaForm;
