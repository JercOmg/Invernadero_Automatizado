import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import aplicacionInsumoService from '../../services/aplicacionInsumoService';
import './AplicacionInsumoList.css';

/**
 * Componente para listar AplicacionInsumo
 */
const AplicacionInsumoList = () => {
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
      const data = await aplicacionInsumoService.getAll();
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
        await aplicacionInsumoService.delete(id);
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
        <h1>AplicacionInsumo</h1>
        <Link to="/aplicacion_insumo/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Id Insumo</th>
            <th>Id Siembra</th>
            <th>Id Zona</th>
            <th>Id Usuario</th>
            <th>Fecha Hora</th>
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
                <tr key={item.idAplicacionInsumo || item.id}>
                  <td>{item.idInsumo}</td>
                <td>{item.idSiembra}</td>
                <td>{item.idZona}</td>
                <td>{item.idUsuario}</td>
                <td>{item.fechaHora}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/aplicacion_insumo/${item.idAplicacionInsumo || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.idAplicacionInsumo || item.id)}
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

export default AplicacionInsumoList;
