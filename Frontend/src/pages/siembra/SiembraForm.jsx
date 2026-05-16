import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import siembraService from '../../services/siembraService';
import './SiembraForm.css';

/**
 * Componente para crear/editar Siembra
 */
const SiembraForm = () => {
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
      const data = await siembraService.getById(id);
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
        await siembraService.update(id, formData);
      } else {
        await siembraService.create(formData);
      }
      navigate('/siembra');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Siembra</h1>

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
            <label htmlFor="idCultivo">Id Cultivo</label>
            <input
              type="number"
              id="idCultivo"
              name="idCultivo"
              value={formData.idCultivo || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="idUsuario">Id Usuario</label>
            <input
              type="number"
              id="idUsuario"
              name="idUsuario"
              value={formData.idUsuario || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="fechaSiembra">Fecha Siembra</label>
            <input
              type="date"
              id="fechaSiembra"
              name="fechaSiembra"
              value={formData.fechaSiembra || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="fechaCosechaEstimada">Fecha Cosecha Estimada</label>
            <input
              type="date"
              id="fechaCosechaEstimada"
              name="fechaCosechaEstimada"
              value={formData.fechaCosechaEstimada || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="cantidadPlantas">Cantidad Plantas</label>
            <input
              type="number"
              id="cantidadPlantas"
              name="cantidadPlantas"
              value={formData.cantidadPlantas || ''}
              onChange={handleChange}
              required
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
              <option value="EN_CRECIMIENTO">EN_CRECIMIENTO</option>\n              <option value="COSECHADO">COSECHADO</option>\n              <option value="PERDIDO">PERDIDO</option>\n              <option value="EN_CUARENTENA">EN_CUARENTENA</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              rows="4"
              
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/siembra')}
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

export default SiembraForm;
