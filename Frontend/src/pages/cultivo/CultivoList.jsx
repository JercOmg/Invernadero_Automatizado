import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cultivoService from '../../services/cultivoService';
import './CultivoList.css';

/**
 * Componente para listar Cultivo
 */
const CultivoList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await cultivoService.getAll();
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
        await cultivoService.delete(id);
        loadItems();
      } catch (err) {
        alert('Error al eliminar el registro');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Cultivo</h1>
        <Link to="/cultivo/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre Comun</th>
            <th>Nombre Cientifico</th>
            <th>Tipo</th>
            <th>Temp Min C</th>
            <th>Temp Max C</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="{100}" style={{ textAlign: 'center' }}>
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.idCultivo || item.id}>
                  <td>{item.nombreComun}</td>
                <td>{item.nombreCientifico}</td>
                <td>{item.tipo}</td>
                <td>{item.tempMinC}</td>
                <td>{item.tempMaxC}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/cultivo/${item.idCultivo || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idCultivo || item.id)}
                        className="btn btn-sm btn-danger"
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
    </div>
  );
};

export default CultivoList;
