import React, { useState, useEffect } from 'react';
import alertaService from '../../services/alertaService';
import sensorService from '../../services/sensorService';
import zonaService from '../../services/zonaService';
import './AlertaForm.css';

/**
 * Componente para crear/editar Alerta
 */
const AlertaForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [sensores, setSensores] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

    useEffect(() => {
    loadRelations();
  }, []);

  const loadRelations = async () => {
    try {
      const [sData, zData] = await Promise.all([
        sensorService.getAll(0, 1000),
        zonaService.getAll(0, 1000)
      ]);
      setSensores(sData.content || sData || []);
      setZonas(zData.content || zData || []);
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
    const sId = formData.idSensorId || formData.idSensor;
    const zId = formData.idZonaId || formData.idZona;
    const payload = {
      ...formData,
      idSensorId: sId,
      idSensor: sId,
      idZonaId: zId,
      idZona: zId
    };

      setLoading(true);
      const data = await alertaService.getById(id);
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
    if (['idSensorId', 'idSensor', 'idZonaId', 'idZona'].includes(name)) { finalValue = value ? parseInt(value, 10) : ''; }
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
        await alertaService.update(id, payload);
      } else {
        await alertaService.create(payload);
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
        {isEdit ? 'Editar' : 'Crear'} Alerta
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group ">
            <label htmlFor="idSensor">Id Sensor</label>
            <input
              type="number"
              id="idSensor"
              name="idSensor"
              value={formData.idSensor || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="idZona">Id Zona</label>
            <input
              type="number"
              id="idZona"
              name="idZona"
              value={formData.idZona || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="tipoAlerta">Tipo Alerta</label>
            <select
              id="tipoAlerta"
              name="tipoAlerta"
              value={formData.tipoAlerta || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="TEMPERATURA_ALTA">TEMPERATURA_ALTA</option>
              <option value="TEMPERATURA_BAJA">TEMPERATURA_BAJA</option>
              <option value="HUMEDAD_ALTA">HUMEDAD_ALTA</option>
              <option value="HUMEDAD_BAJA">HUMEDAD_BAJA</option>
              <option value="CO2_ALTO">CO2_ALTO</option>
              <option value="PH_FUERA_RANGO">PH_FUERA_RANGO</option>
              <option value="FALLA_SENSOR">FALLA_SENSOR</option>
              <option value="PLAGA_ENFERMEDAD">PLAGA_ENFERMEDAD</option>
            </select>
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows="3"
              required
              className="form-control"
            />
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
            <label htmlFor="nivel">Nivel</label>
            <select
              id="nivel"
              name="nivel"
              value={formData.nivel || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="INFORMATIVA">INFORMATIVA</option>
              <option value="ADVERTENCIA">ADVERTENCIA</option>
              <option value="CRITICA">CRITICA</option>
            </select>
          </div>

          <div className="form-group checkbox-group md:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                name="resuelta"
                checked={formData.resuelta || false}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              Resuelta
            </label>
          </div>

          <div className="form-group ">
            <label htmlFor="fechaResolucion">Fecha Resolucion</label>
            <input
              type="datetime-local"
              id="fechaResolucion"
              name="fechaResolucion"
              value={formData.fechaResolucion || ''}
              onChange={handleChange}
              
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

export default AlertaForm;
