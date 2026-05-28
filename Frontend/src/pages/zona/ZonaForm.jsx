import React, { useState, useEffect } from 'react';
import zonaService from '../../services/zonaService';
import invernaderoService from '../../services/invernaderoService';
import './ZonaForm.css';

/**
 * Componente para crear/editar Zona
 */
const ZonaForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invernaderos, setInvernaderos] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    loadInvernaderos();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadItem();
    } else {
      setFormData({});
    }
  }, [id]);

  const loadInvernaderos = async () => {
    try {
      const response = await invernaderoService.getAll(0, 1000);
      setInvernaderos(response.content || response || []);
    } catch (err) {
      console.error('Error al cargar invernaderos:', err);
    }
  };

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
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'idInvernaderoId' || name === 'idInvernadero') {
      finalValue = value ? parseInt(value, 10) : '';
    }
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const invId = formData.idInvernaderoId || formData.idInvernadero;
    const payload = {
      ...formData,
      idInvernaderoId: invId,
      idInvernadero: invId
    };

    try {
      if (isEdit) {
        await zonaService.update(id, payload);
      } else {
        await zonaService.create(payload);
      }
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="form-container-modal">
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">
        {isEdit ? 'Editar' : 'Crear'} Zona
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group">
            <label htmlFor="idInvernaderoId">Invernadero</label>
            <select
              id="idInvernaderoId"
              name="idInvernaderoId"
              value={formData.idInvernaderoId || formData.idInvernadero || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar invernadero...</option>
              {invernaderos.map((i) => (
                <option key={i.idInvernadero} value={i.idInvernadero}>
                  {i.nombre} ({i.ubicacion})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group ">
            <label htmlFor="nombreZona">Nombre Zona</label>
            <input
              type="text"
              id="nombreZona"
              name="nombreZona"
              value={formData.nombreZona || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="areaM2">Area M2</label>
            <input
              type="number"
              id="areaM2"
              name="areaM2"
              value={formData.areaM2 || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows="3"
              
              className="form-control"
            />
          </div>

        <div className="form-actions md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
          <button
            type="button"
            className="btn btn-secondary border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold px-5 py-2.5 rounded-lg transition-all text-sm cursor-pointer"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-xs transition-all text-sm cursor-pointer" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZonaForm;
