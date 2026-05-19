/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InsumoForm
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio InsumoForm
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import insumoService from '../../services/insumoService';
import './InsumoForm.css';

/**
 * Componente para crear/editar Insumo
 */
const InsumoForm = () => {
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
      const data = await insumoService.getById(id);
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
        await insumoService.update(id, formData);
      } else {
        await insumoService.create(formData);
      }
      navigate('/insumo');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Insumo</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              required
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
              <option value="FERTILIZANTE">FERTILIZANTE</option>\n              <option value="PESTICIDA">PESTICIDA</option>\n              <option value="FUNGICIDA">FUNGICIDA</option>\n              <option value="SUSTRATO">SUSTRATO</option>\n              <option value="AGUA">AGUA</option>\n              <option value="OTRO">OTRO</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="unidad">Unidad</label>
            <select
              id="unidad"
              name="unidad"
              value={formData.unidad || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="kg">kg</option>\n              <option value="g">g</option>\n              <option value="L">L</option>\n              <option value="mL">mL</option>\n              <option value="unidad">unidad</option>
            </select>
          </div>\n\n          <div className="form-group">
            <label htmlFor="stockActual">Stock Actual</label>
            <input
              type="number"
              id="stockActual"
              name="stockActual"
              value={formData.stockActual || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="stockMinimo">Stock Minimo</label>
            <input
              type="number"
              id="stockMinimo"
              name="stockMinimo"
              value={formData.stockMinimo || ''}
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
              onClick={() => navigate('/insumo')}
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

export default InsumoForm;
