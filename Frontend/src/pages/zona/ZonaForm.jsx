import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import zonaService from '../../services/zonaService';
import './ZonaForm.css';

/**
 * Componente para crear/editar Zona
 */
const ZonaForm = () => {
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
      const data = await zonaService.getById(id);
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
        await zonaService.update(id, formData);
      } else {
        await zonaService.create(formData);
      }
      navigate('/zona');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Zona</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idInvernadero">Id Invernadero</label>
            <input
              type="number"
              id="idInvernadero"
              name="idInvernadero"
              value={formData.idInvernadero || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="nombreZona">Nombre Zona</label>
            <input
              type="text"
              id="nombreZona"
              name="nombreZona"
              value={formData.nombreZona || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="areaM2">Area M2</label>
            <input
              type="number"
              id="areaM2"
              name="areaM2"
              value={formData.areaM2 || ''}
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
              onClick={() => navigate('/zona')}
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

export default ZonaForm;
