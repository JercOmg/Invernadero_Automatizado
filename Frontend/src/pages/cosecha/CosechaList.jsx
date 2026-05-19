/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CosechaList
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio CosechaList
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await cosechaService.getAll();
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
        await cosechaService.delete(id);
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
        <h1>Cosecha</h1>
        <Link to="/cosecha/new" className="btn btn-primary">
          {t('common.createNew')}
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
                      >{t('common.edit')}</button>
                      <button
                        onClick={() => handleDelete(item.idCosecha || item.id)}
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

export default CosechaList;
