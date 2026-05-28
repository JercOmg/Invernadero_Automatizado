import React, { useState, useEffect } from 'react';
import invernaderoService from '../../services/invernaderoService';
import authService from '../../services/authService';
import './InvernaderoForm.css';

/**
 * Componente para crear/editar Invernadero
 */
const InvernaderoForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadItem();
    } else {
      setFormData({});
    }
  }, [id]);

  const loadUsuarios = async () => {
    try {
      const data = await authService.getUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

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
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'responsableId') {
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

    try {
      if (isEdit) {
        await invernaderoService.update(id, formData);
      } else {
        await invernaderoService.create(formData);
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
        {isEdit ? 'Editar' : 'Crear'} Invernadero
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group ">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="ubicacion">Ubicacion</label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion || ''}
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
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="tipoEstructura">Tipo Estructura</label>
            <select
              id="tipoEstructura"
              name="tipoEstructura"
              value={formData.tipoEstructura || ''}
              onChange={handleChange}
              
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="VIDRIO">VIDRIO</option>
              <option value="POLICARBONATO">POLICARBONATO</option>
              <option value="MALLA">MALLA</option>
              <option value="PLASTICO">PLASTICO</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsableId">Responsable</label>
            <select
              id="responsableId"
              name="responsableId"
              value={formData.responsableId || ''}
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
            <label htmlFor="fechaCreacion">Fecha Creacion</label>
            <input
              type="date"
              id="fechaCreacion"
              name="fechaCreacion"
              value={formData.fechaCreacion || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
            </select>
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

export default InvernaderoForm;
