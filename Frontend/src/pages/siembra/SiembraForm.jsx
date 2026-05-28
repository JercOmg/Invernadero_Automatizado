import React, { useState, useEffect } from 'react';
import siembraService from '../../services/siembraService';
import zonaService from '../../services/zonaService';
import cultivoService from '../../services/cultivoService';
import authService from '../../services/authService';
import './SiembraForm.css';

/**
 * Componente para crear/editar Siembra
 */
const SiembraForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zonas, setZonas] = useState([]);
  const [cultivos, setCultivos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    loadRelations();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadItem();
    } else {
      setFormData({});
    }
  }, [id]);

  const loadRelations = async () => {
    try {
      const [resZonas, resCultivos, resUsuarios] = await Promise.all([
        zonaService.getAll(0, 1000),
        cultivoService.getAll(0, 1000),
        authService.getUsuarios()
      ]);
      setZonas(resZonas.content || resZonas || []);
      setCultivos(resCultivos.content || resCultivos || []);
      setUsuarios(resUsuarios || []);
    } catch (err) {
      console.error('Error al cargar datos relacionales:', err);
    }
  };

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await siembraService.getById(id);
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
    if (['idZonaId', 'idZona', 'idCultivoId', 'idCultivo', 'idUsuarioId', 'idUsuario', 'cantidadPlantas'].includes(name)) {
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

    const zonaId = formData.idZonaId || formData.idZona;
    const cultivoId = formData.idCultivoId || formData.idCultivo;
    const usuarioId = formData.idUsuarioId || formData.idUsuario;

    const payload = {
      ...formData,
      idZonaId: zonaId,
      idZona: zonaId,
      idCultivoId: cultivoId,
      idCultivo: cultivoId,
      idUsuarioId: usuarioId,
      idUsuario: usuarioId
    };

    try {
      if (isEdit) {
        await siembraService.update(id, payload);
      } else {
        await siembraService.create(payload);
      }
      if (onClose) onClose();
    } catch (err) {
      let msg = err.response?.data?.message || 'Error al guardar los datos';
      if (msg.includes('could not execute statement') || msg.includes('constraint') || msg.includes('SQL') || msg.includes('null value')) {
        msg = 'Ocurrió un error en la base de datos al guardar. Por favor, verifica que todos los campos requeridos tengan valores correctos.';
      }
      setError(msg);
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
        {isEdit ? 'Editar' : 'Crear'} Siembra
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
                  {z.nombreZona} (ID Invernadero: {z.idInvernaderoId || z.idInvernadero})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idCultivoId">Cultivo</label>
            <select
              id="idCultivoId"
              name="idCultivoId"
              value={formData.idCultivoId || formData.idCultivo || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar cultivo...</option>
              {cultivos.map((c) => (
                <option key={c.idCultivo} value={c.idCultivo}>
                  {c.nombreComun} ({c.nombreCientifico})
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
            <label htmlFor="fechaSiembra">Fecha Siembra</label>
            <input
              type="date"
              id="fechaSiembra"
              name="fechaSiembra"
              value={formData.fechaSiembra || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="fechaCosechaEstimada">Fecha Cosecha Estimada</label>
            <input
              type="date"
              id="fechaCosechaEstimada"
              name="fechaCosechaEstimada"
              value={formData.fechaCosechaEstimada || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="cantidadPlantas">Cantidad Plantas</label>
            <input
              type="number"
              id="cantidadPlantas"
              name="cantidadPlantas"
              value={formData.cantidadPlantas || ''}
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
              <option value="EN_CRECIMIENTO">EN_CRECIMIENTO</option>
              <option value="COSECHADO">COSECHADO</option>
              <option value="PERDIDO">PERDIDO</option>
              <option value="EN_CUARENTENA">EN_CUARENTENA</option>
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

export default SiembraForm;
