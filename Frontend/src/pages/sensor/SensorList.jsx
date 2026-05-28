import React, { useState, useEffect } from 'react';
import sensorService from '../../services/sensorService';
import SensorForm from './SensorForm';
import './SensorList.css';

/**
 * Componente para listar Sensor
 */
const SensorList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await sensorService.getAll();
      setItems(data.content || data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await sensorService.delete(id);
        loadItems();
      } catch (err) {
        alert('Error al eliminar el registro');
        console.error(err);
      }
    }
  };

  if (loading && items.length === 0) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="list-container max-w-7xl mx-auto px-4 py-8">
      <div className="list-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Sensor</h1>
        <button 
          onClick={() => { setCurrentId(null); setIsModalOpen(true); }} 
          className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all text-sm cursor-pointer"
        >
          Crear Nuevo
        </button>
      </div>

      {error && <div className="error-message mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm">{error}</div>}

      <div className="table-container rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th>Id Zona</th>
            <th>Tipo Sensor</th>
            <th>Modelo</th>
            <th>Unidad Medida</th>
            <th>Fecha Instalacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="{100}" style={{ textAlign: 'center' }}>
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.idSensor || item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td>{item.idZona}</td>
                <td>{item.tipoSensor}</td>
                <td>{item.modelo}</td>
                <td>{item.unidadMedida}</td>
                <td>{item.fechaInstalacion}</td>
                  <td>
                    <div className="action-buttons flex gap-2">
                      <button
                        onClick={() => { setCurrentId(item.idSensor || item.id); setIsModalOpen(true); }}
                        className="btn btn-sm btn-primary border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold px-3 py-1.5 rounded-lg transition-all text-xs cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idSensor || item.id)}
                        className="btn btn-sm btn-danger bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold px-3 py-1.5 rounded-lg transition-all text-xs cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear y Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-fade-in p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto relative animate-scale-up">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light focus:outline-none cursor-pointer"
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            <SensorForm id={currentId} onClose={() => { setIsModalOpen(false); loadItems(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorList;
