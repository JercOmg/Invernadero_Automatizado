/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SensorForm
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio SensorForm
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sensorService from '../../services/sensorService';
import './SensorForm.css';

/**
 * Componente para crear/editar Sensor
 */
const SensorForm = () => {
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
      const data = await sensorService.getById(id);
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
        await sensorService.update(id, formData);
      } else {
        await sensorService.create(formData);
      }
      navigate('/sensor');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Sensor</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idZona">Id Zona</label>
            <input
              type="number"
              id="idZona"
              name="idZona"
              value={formData.idZona || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="tipoSensor">Tipo Sensor</label>
            <select
              id="tipoSensor"
              name="tipoSensor"
              value={formData.tipoSensor || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="TEMPERATURA">TEMPERATURA</option>\n              <option value="HUMEDAD">HUMEDAD</option>\n              <option value="CO2">CO2</option>\n              <option value="LUMINOSIDAD">LUMINOSIDAD</option>\n              <option value="PH">PH</option>\n              <option value="HUMEDAD_SUELO">HUMEDAD_SUELO</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="unidadMedida">Unidad Medida</label>
            <input
              type="text"
              id="unidadMedida"
              name="unidadMedida"
              value={formData.unidadMedida || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="fechaInstalacion">Fecha Instalacion</label>
            <input
              type="date"
              id="fechaInstalacion"
              name="fechaInstalacion"
              value={formData.fechaInstalacion || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="ACTIVO">ACTIVO</option>\n              <option value="INACTIVO">INACTIVO</option>\n              <option value="FALLA">FALLA</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/sensor')}
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

export default SensorForm;
