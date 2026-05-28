import React, { useState, useEffect } from 'react';
import aplicacionInsumoService from '../../services/aplicacionInsumoService';
import insumoService from '../../services/insumoService';
import siembraService from '../../services/siembraService';
import zonaService from '../../services/zonaService';
import authService from '../../services/authService';
import './AplicacionInsumoForm.css';

/**
 * Componente para crear/editar AplicacionInsumo
 */
const AplicacionInsumoForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [insumos, setInsumos] = useState([]);
  const [siembras, setSiembras] = useState([]);
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
      const [iData, sData, zData, uData] = await Promise.all([
        insumoService.getAll(0, 1000),
        siembraService.getAll(0, 1000),
        zonaService.getAll(0, 1000),
        authService.getUsuarios()
      ]);
      setInsumos(iData.content || iData || []);
      setSiembras(sData.content || sData || []);
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
    let finalValue = type === 'checkbox' ? checked : value;
    if (['idInsumoId', 'idInsumo', 'idSiembraId', 'idSiembra', 'idZonaId', 'idZona', 'idUsuarioId', 'idUsuario'].includes(name)) { finalValue = value ? parseInt(value, 10) : ''; }
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const insId = formData.idInsumoId || formData.idInsumo;
    const sId = formData.idSiembraId || formData.idSiembra;
    const zId = formData.idZonaId || formData.idZona;
    const uId = formData.idUsuarioId || formData.idUsuario;
    const payload = {
      ...formData,
      idInsumoId: insId,
      idInsumo: insId,
      idSiembraId: sId,
      idSiembra: sId,
      idZonaId: zId,
      idZona: zId,
      idUsuarioId: uId,
      idUsuario: uId
    };

    try {
      if (isEdit) {
        await aplicacionInsumoService.update(id, payload);
      } else {
        await aplicacionInsumoService.create(payload);
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
        {isEdit ? 'Editar' : 'Crear'} AplicacionInsumo
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group">
            <label htmlFor="idInsumoId">Insumo</label>
            <select
              id="idInsumoId"
              name="idInsumoId"
              value={formData.idInsumoId || formData.idInsumo || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar insumo...</option>
              {insumos.map((ins) => (
                <option key={ins.idInsumo} value={ins.idInsumo}>
                  {ins.nombre} ({ins.tipo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idSiembraId">Siembra</label>
            <select
              id="idSiembraId"
              name="idSiembraId"
              value={formData.idSiembraId || formData.idSiembra || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar siembra...</option>
              {siembras.map((s) => (
                <option key={s.idSiembra} value={s.idSiembra}>
                  Siembra #{s.idSiembra} - Plantas: {s.cantidadPlantas} ({s.estado})
                </option>
              ))}
            </select>
          </div>

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
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="metodo">Metodo</label>
            <select
              id="metodo"
              name="metodo"
              value={formData.metodo || ''}
              onChange={handleChange}
              
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="FOLIAR">FOLIAR</option>
              <option value="RIEGO">RIEGO</option>
              <option value="SUELO">SUELO</option>
              <option value="INYECCION">INYECCION</option>
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

export default AplicacionInsumoForm;
