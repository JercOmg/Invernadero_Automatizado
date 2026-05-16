import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import invernaderoService from '../../services/invernaderoService';
import './InvernaderoList.css';

/**
 * Componente para listar Invernadero
 */
const InvernaderoList = () => {
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
      const data = await invernaderoService.getAll();
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
        await invernaderoService.delete(id);
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
        <h1>Invernadero</h1>
        <Link to="/invernadero/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
            <th>Ubicacion</th>
            <th>Area M2</th>
            <th>Tipo Estructura</th>
            <th>Responsable Id</th>
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
                <tr key={item.idInvernadero || item.id}>
                  <td>{item.nombre}</td>
                <td>{item.ubicacion}</td>
                <td>{item.areaM2}</td>
                <td>{item.tipoEstructura}</td>
                <td>{item.responsableId}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/invernadero/${item.idInvernadero || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idInvernadero || item.id)}
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

export default InvernaderoList;
