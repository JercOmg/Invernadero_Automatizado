import React, { useState, useEffect } from 'react';
import cultivoService from '../../services/cultivoService';
import './CultivoForm.css';

/**
 * Componente para crear/editar Cultivo
 */
const CultivoForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      loadItem();
    } else {
      setFormData({});
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
        {isEdit ? 'Editar' : 'Crear'} Cultivo
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group ">
            <label htmlFor="nombreComun">Nombre Comun</label>
            <input
              type="text"
              id="nombreComun"
              name="nombreComun"
              value={formData.nombreComun || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="nombreCientifico">Nombre Cientifico</label>
            <input
              type="text"
              id="nombreCientifico"
              name="nombreCientifico"
              value={formData.nombreCientifico || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="HORTALIZA">HORTALIZA</option>
              <option value="FRUTA">FRUTA</option>
              <option value="FLOR">FLOR</option>
              <option value="HIERBA">HIERBA</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>

          <div className="form-group ">
            <label htmlFor="tempMinC">Temp Min C</label>
            <input
              type="number"
              id="tempMinC"
              name="tempMinC"
              value={formData.tempMinC || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="tempMaxC">Temp Max C</label>
            <input
              type="number"
              id="tempMaxC"
              name="tempMaxC"
              value={formData.tempMaxC || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="humedadMinPct">Humedad Min Pct</label>
            <input
              type="number"
              id="humedadMinPct"
              name="humedadMinPct"
              value={formData.humedadMinPct || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="humedadMaxPct">Humedad Max Pct</label>
            <input
              type="number"
              id="humedadMaxPct"
              name="humedadMaxPct"
              value={formData.humedadMaxPct || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="diasCiclo">Dias Ciclo</label>
            <input
              type="number"
              id="diasCiclo"
              name="diasCiclo"
              value={formData.diasCiclo || ''}
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

export default CultivoForm;
