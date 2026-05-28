import React, { useState, useEffect } from 'react';
import riegoService from '../../services/riegoService';
import zonaService from '../../services/zonaService';
import authService from '../../services/authService';
import './RiegoForm.css';

/**
 * Componente para crear/editar Riego
 */
const RiegoForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [zonas, setZonas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

    useEffect(() => {
    loadRelations();
  }, []);

  const loadRelations = async () => {
    try {
      const [zData, uData] = await Promise.all([
        zonaService.getAll(0, 1000),
        authService.getUsuarios()
      ]);
      setZonas(zData.content || zData || []);
      setUsuarios(uData || []);
    } catch (err) {
      console.error(err);
    }
  };

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
      const data = await riegoService.getById(id);
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
    if (['idZonaId', 'idZona', 'idUsuarioId', 'idUsuario'].includes(name)) { finalValue = value ? parseInt(value, 10) : ''; }
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const zId = formData.idZonaId || formData.idZona;
    const uId = formData.idUsuarioId || formData.idUsuario;
    const payload = {
      ...formData,
      idZonaId: zId,
      idZona: zId,
      idUsuarioId: uId,
      idUsuario: uId
    };

    try {
      if (isEdit) {
        await riegoService.update(id, payload);
      } else {
        await riegoService.create(payload);
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
        {isEdit ? 'Editar' : 'Crear'} Riego
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group">
            <label htmlFor="idZonaId">Zona</label>
            <select
              id="idZonaId"
              name="idZonaId"
              value={formData.idZonaId || formData.idZona || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar zona...</option>
              {zonas.map((z) => (
                <option key={z.idZona} value={z.idZona}>
                  {z.nombreZona}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idUsuarioId">Responsable</label>
            <select
              id="idUsuarioId"
              name="idUsuarioId"
              value={formData.idUsuarioId || formData.idUsuario || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar responsable...</option>
              {usuarios.map((u) => (
                <option key={u.idUsuario} value={u.idUsuario}>
                  {u.nombre} {u.apellido} ({u.rol})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group ">
            <label htmlFor="fechaHora">Fecha Hora</label>
            <input
              type="datetime-local"
              id="fechaHora"
              name="fechaHora"
              value={formData.fechaHora || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="duracionMin">Duracion Min</label>
            <input
              type="number"
              id="duracionMin"
              name="duracionMin"
              value={formData.duracionMin || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="volumenLitros">Volumen Litros</label>
            <input
              type="number"
              id="volumenLitros"
              name="volumenLitros"
              value={formData.volumenLitros || ''}
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
              <option value="AUTOMATICO">AUTOMATICO</option>
              <option value="MANUAL">MANUAL</option>
            </select>
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones || ''}
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

export default RiegoForm;
