/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumoForm
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio AplicacionInsumoForm
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import aplicacionInsumoService from '../../services/aplicacionInsumoService';
import './AplicacionInsumoForm.css';

/**
 * Componente para crear/editar AplicacionInsumo
 */
/**
 * Componente AplicacionInsumoForm
 * @returns {JSX.Element}
 */
const AplicacionInsumoForm = () => {
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
      const data = await aplicacionInsumoService.getById(id);
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
        await aplicacionInsumoService.update(id, formData);
      } else {
        await aplicacionInsumoService.create(formData);
      }
      navigate('/aplicacion_insumo');
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
        <h1>{isEdit ? 'Editar' : 'Crear'} AplicacionInsumo</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idInsumo">Id Insumo</label>
            <input
              type="number"
              id="idInsumo"
              name="idInsumo"
              value={formData.idInsumo || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="idSiembra">Id Siembra</label>
            <input
              type="number"
              id="idSiembra"
              name="idSiembra"
              value={formData.idSiembra || ''}
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
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad || ''}
              onChange={handleChange}
              required
            />
          </div>\n\n          <div className="form-group">
            <label htmlFor="metodo">Metodo</label>
            <select
              id="metodo"
              name="metodo"
              value={formData.metodo || ''}
              onChange={handleChange}
              
            >
              <option value="">Seleccionar...</option>
              <option value="FOLIAR">FOLIAR</option>\n              <option value="RIEGO">RIEGO</option>\n              <option value="SUELO">SUELO</option>\n              <option value="INYECCION">INYECCION</option>
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
              onClick={() => navigate('/aplicacion_insumo')}
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

export default AplicacionInsumoForm;
