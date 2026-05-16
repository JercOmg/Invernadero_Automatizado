import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import siembraService from '../../services/siembraService';
import './SiembraList.css';

/**
 * Componente para listar Siembra
 */
const SiembraList = () => {
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
      const data = await siembraService.getAll();
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
        await siembraService.delete(id);
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
        <h1>Siembra</h1>
        <Link to="/siembra/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Id Zona</th>
            <th>Id Cultivo</th>
            <th>Id Usuario</th>
            <th>Fecha Siembra</th>
            <th>Fecha Cosecha Estimada</th>
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
                <tr key={item.idSiembra || item.id}>
                  <td>{item.idZona}</td>
                <td>{item.idCultivo}</td>
                <td>{item.idUsuario}</td>
                <td>{item.fechaSiembra}</td>
                <td>{item.fechaCosechaEstimada}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/siembra/${item.idSiembra || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idSiembra || item.id)}
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

export default SiembraList;
