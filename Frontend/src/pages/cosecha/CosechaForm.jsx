/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CosechaForm
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio CosechaForm
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cosechaService from '../../services/cosechaService';
import './CosechaForm.css';

/**
 * Componente para crear/editar Cosecha
 */
const CosechaForm = () => {
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
      const data = await cosechaService.getById(id);
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
        await cosechaService.update(id, formData);
      } else {
        await cosechaService.create(formData);
      }
      navigate('/cosecha');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Cosecha</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idSiembra">Id Siembra</label>
            <input
              type="number"
              id="idSiembra"
              name="idSiembra"
              value={formData.idSiembra || ''}
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
            <label htmlFor="fechaCosecha">Fecha Cosecha</label>
            <input
              type="date"
              id="fechaCosecha"
              name="fechaCosecha"
              value={formData.fechaCosecha || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="cantidadKg">Cantidad Kg</label>
            <input
              type="number"
              id="cantidadKg"
              name="cantidadKg"
              value={formData.cantidadKg || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="calidad">Calidad</label>
            <select
              id="calidad"
              name="calidad"
              value={formData.calidad || ''}
              onChange={handleChange}
              
            >
              <option value="">Seleccionar...</option>
              <option value="PREMIUM">PREMIUM</option>\n              <option value="ESTANDAR">ESTANDAR</option>\n              <option value="SEGUNDA">SEGUNDA</option>\n              <option value="DESCARTE">DESCARTE</option>
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
              onClick={() => navigate('/cosecha')}
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

export default CosechaForm;
