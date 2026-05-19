import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await siembraService.getAll();
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
        await siembraService.delete(id);
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
        <h1>Siembra</h1>
        <Link to="/siembra/new" className="btn btn-primary">
          {t('common.createNew')}
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
                      >{t('common.edit')}</button>
                      <button
                        onClick={() => handleDelete(item.idSiembra || item.id)}
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

export default SiembraList;
