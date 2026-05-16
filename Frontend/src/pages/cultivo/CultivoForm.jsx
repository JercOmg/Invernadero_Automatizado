import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cultivoService from '../../services/cultivoService';
import './CultivoForm.css';

/**
 * Componente para crear/editar Cultivo
 */
const CultivoForm = () => {
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
      const data = await cultivoService.getById(id);
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
        await cultivoService.update(id, formData);
      } else {
        await cultivoService.create(formData);
      }
      navigate('/cultivo');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Cultivo</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreComun">Nombre Comun</label>
            <input
              type="text"
              id="nombreComun"
              name="nombreComun"
              value={formData.nombreComun || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="nombreCientifico">Nombre Cientifico</label>
            <input
              type="text"
              id="nombreCientifico"
              name="nombreCientifico"
              value={formData.nombreCientifico || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="HORTALIZA">HORTALIZA</option>\n              <option value="FRUTA">FRUTA</option>\n              <option value="FLOR">FLOR</option>\n              <option value="HIERBA">HIERBA</option>\n              <option value="OTRO">OTRO</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="tempMinC">Temp Min C</label>
            <input
              type="number"
              id="tempMinC"
              name="tempMinC"
              value={formData.tempMinC || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="tempMaxC">Temp Max C</label>
            <input
              type="number"
              id="tempMaxC"
              name="tempMaxC"
              value={formData.tempMaxC || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="humedadMinPct">Humedad Min Pct</label>
            <input
              type="number"
              id="humedadMinPct"
              name="humedadMinPct"
              value={formData.humedadMinPct || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="humedadMaxPct">Humedad Max Pct</label>
            <input
              type="number"
              id="humedadMaxPct"
              name="humedadMaxPct"
              value={formData.humedadMaxPct || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="diasCiclo">Dias Ciclo</label>
            <input
              type="number"
              id="diasCiclo"
              name="diasCiclo"
              value={formData.diasCiclo || ''}
              onChange={handleChange}
              
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
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
              onClick={() => navigate('/cultivo')}
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

export default CultivoForm;
