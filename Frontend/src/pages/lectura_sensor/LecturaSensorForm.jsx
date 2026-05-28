import React, { useState, useEffect } from 'react';
import lecturaSensorService from '../../services/lecturaSensorService';
import sensorService from '../../services/sensorService';
import './LecturaSensorForm.css';

/**
 * Componente para crear/editar LecturaSensor
 */
const LecturaSensorForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

    useEffect(() => {
    loadRelations();
  }, []);

  const loadRelations = async () => {
    try {
      const data = await sensorService.getAll(0, 1000);
      setSensores(data.content || data || []);
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
      const data = await lecturaSensorService.getById(id);
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
    if (name === 'idSensorId' || name === 'idSensor') { finalValue = value ? parseInt(value, 10) : ''; }
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const sId = formData.idSensorId || formData.idSensor;
    const payload = {
      ...formData,
      idSensorId: sId,
      idSensor: sId
    };

    try {
      if (isEdit) {
        await lecturaSensorService.update(id, payload);
      } else {
        await lecturaSensorService.create(payload);
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
        {isEdit ? 'Editar' : 'Crear'} LecturaSensor
      </h2>

      {error && (
        <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-group">
            <label htmlFor="idSensorId">Sensor</label>
            <select
              id="idSensorId"
              name="idSensorId"
              value={formData.idSensorId || formData.idSensor || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar sensor...</option>
              {sensores.map((s) => (
                <option key={s.idSensor} value={s.idSensor}>
                  Sensor #{s.idSensor} - {s.tipoSensor} ({s.modelo || 'Sin Modelo'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group ">
            <label htmlFor="valor">Valor</label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor || ''}
              onChange={handleChange}
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

          <div className="form-group checkbox-group md:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                name="generaAlerta"
                checked={formData.generaAlerta || false}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              Genera Alerta
            </label>
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

export default LecturaSensorForm;
