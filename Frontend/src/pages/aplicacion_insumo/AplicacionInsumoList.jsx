import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await aplicacionInsumoService.getAll();
      setItems(data.content || data);
    } catch (err) {
      setError(t('common.errorLoading'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await aplicacionInsumoService.delete(id);
        loadItems();
      } catch (err) {
        alert(t('common.errorDeleting'));
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
          {t('common.createNew')}
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
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="{100}" style={{ textAlign: 'center' }}>
                  {t('common.noRecords')}
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
                      >{t('common.edit')}</button>
                      <button
                        onClick={() => handleDelete(item.idAplicacionInsumo || item.id)}
                        className="btn btn-sm btn-danger"
                      >{t('common.delete')}</button>
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
