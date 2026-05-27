import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import invernaderoService from '../../services/invernaderoService';
import './InvernaderoForm.css';

/**
 * Componente para crear/editar Invernadero
 */
const InvernaderoForm = () => {
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
      const data = await invernaderoService.getById(id);
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
        await invernaderoService.update(id, formData);
      } else {
        await invernaderoService.create(formData);
      }
      navigate('/invernadero');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} Invernadero</h1>

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
          </div>

          <div className="form-group">
            <label htmlFor="ubicacion">Ubicacion</label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="areaM2">Area M2</label>
            <input
              type="number"
              id="areaM2"
              name="areaM2"
              value={formData.areaM2 || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoEstructura">Tipo Estructura</label>
            <select
              id="tipoEstructura"
              name="tipoEstructura"
              value={formData.tipoEstructura || ''}
              onChange={handleChange}
              
            >
              <option value="">Seleccionar...</option>
              <option value="VIDRIO">VIDRIO</option>
              <option value="POLICARBONATO">POLICARBONATO</option>
              <option value="MALLA">MALLA</option>
              <option value="PLASTICO">PLASTICO</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsableId">Responsable Id</label>
            <input
              type="number"
              id="responsableId"
              name="responsableId"
              value={formData.responsableId || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaCreacion">Fecha Creacion</label>
            <input
              type="date"
              id="fechaCreacion"
              name="fechaCreacion"
              value={formData.fechaCreacion || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/invernadero')}
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

export default InvernaderoForm;
