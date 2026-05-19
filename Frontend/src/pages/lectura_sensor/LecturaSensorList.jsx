import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import lecturaSensorService from '../../services/lecturaSensorService';
import './LecturaSensorList.css';

/**
 * Componente para listar LecturaSensor
 */
const LecturaSensorList = () => {
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
      const data = await lecturaSensorService.getAll();
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
        await lecturaSensorService.delete(id);
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
        <h1>LecturaSensor</h1>
        <Link to="/lectura_sensor/new" className="btn btn-primary">
          {t('common.createNew')}
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Id Sensor</th>
            <th>Valor</th>
            <th>Fecha Hora</th>
            <th>Genera Alerta</th>
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
                <tr key={item.idLecturaSensor || item.id}>
                  <td>{item.idSensor}</td>
                <td>{item.valor}</td>
                <td>{item.fechaHora}</td>
                <td>{item.generaAlerta}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => navigate(`/lectura_sensor/${item.idLecturaSensor || item.id}`)}
                        className="btn btn-sm btn-primary"
                      >{t('common.edit')}</button>
                      <button
                        onClick={() => handleDelete(item.idLecturaSensor || item.id)}
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

export default LecturaSensorList;
