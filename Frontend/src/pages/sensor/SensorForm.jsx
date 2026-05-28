import React, { useState, useEffect } from 'react';
import sensorService from '../../services/sensorService';
import zonaService from '../../services/zonaService';
import './SensorForm.css';

/**
 * Componente para crear/editar Sensor
 */
const SensorForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({});
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

    useEffect(() => {
    loadRelations();
  }, []);

  const loadRelations = async () => {
    try {
      const data = await zonaService.getAll(0, 1000);
      setZonas(data.content || data || []);
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
      const data = await sensorService.getById(id);
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
    if (name === 'idZonaId' || name === 'idZona') { finalValue = value ? parseInt(value, 10) : ''; }
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
    const payload = {
      ...formData,
      idZonaId: zId,
      idZona: zId
    };

    try {
      if (isEdit) {
        await sensorService.update(id, payload);
      } else {
        await sensorService.create(payload);
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
        {isEdit ? 'Editar' : 'Crear'} Sensor
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

          <div className="form-group ">
            <label htmlFor="tipoSensor">Tipo Sensor</label>
            <select
              id="tipoSensor"
              name="tipoSensor"
              value={formData.tipoSensor || ''}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Seleccionar...</option>
              <option value="TEMPERATURA">TEMPERATURA</option>
              <option value="HUMEDAD">HUMEDAD</option>
              <option value="CO2">CO2</option>
              <option value="LUMINOSIDAD">LUMINOSIDAD</option>
              <option value="PH">PH</option>
              <option value="HUMEDAD_SUELO">HUMEDAD_SUELO</option>
            </select>
          </div>

          <div className="form-group ">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo || ''}
              onChange={handleChange}
              
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="unidadMedida">Unidad Medida</label>
            <input
              type="text"
              id="unidadMedida"
              name="unidadMedida"
              value={formData.unidadMedida || ''}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group ">
            <label htmlFor="fechaInstalacion">Fecha Instalacion</label>
            <input
              type="date"
              id="fechaInstalacion"
              name="fechaInstalacion"
              value={formData.fechaInstalacion || ''}
              onChange={handleChange}
              
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
              <option value="FALLA">FALLA</option>
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

export default SensorForm;
