import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cosechaService from '../../services/cosechaService';
import './CosechaList.css';

/**
 * Componente para listar Cosecha
 */
const CosechaList = () => {
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
      const data = await cosechaService.getAll();
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
        await cosechaService.delete(id);
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
        <h1>Cosecha</h1>
        <Link to="/cosecha/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Id Siembra</th>
            <th>Id Usuario</th>
            <th>Fecha Cosecha</th>
            <th>Cantidad Kg</th>
            <th>Calidad</th>
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
                <tr key={item.idCosecha || item.id}>
                  <td>{item.idSiembra}</td>
                <td>{item.idUsuario}</td>
                <td>{item.fechaCosecha}</td>
                <td>{item.cantidadKg}</td>
                <td>{item.calidad}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/cosecha/${item.idCosecha || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idCosecha || item.id)}
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

export default CosechaList;
