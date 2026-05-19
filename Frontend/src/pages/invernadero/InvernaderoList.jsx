import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await invernaderoService.getAll();
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
        await invernaderoService.delete(id);
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
        <h1>{t('invernadero.title')}</h1>
        <Link to="/invernadero/new" className="btn btn-primary">
          {t('common.createNew')}
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('invernadero.name')}</th>
            <th>{t('invernadero.location')}</th>
            <th>{t('invernadero.area')}</th>
            <th>{t('invernadero.type')}</th>
            <th>{t('invernadero.managerId')}</th>
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
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(item.idInvernadero || item.id)}
                        className="btn btn-sm btn-danger"
                      >
                        {t('common.delete')}
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
