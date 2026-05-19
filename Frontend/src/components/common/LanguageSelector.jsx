/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: LanguageSelector
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio LanguageSelector
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

/**
 * Componente LanguageSelector
 * @returns {JSX.Element}
 */
const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <select 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label={t('common.language')}
      >
        <option value="es">{t('common.spanish')}</option>
        <option value="en">{t('common.english')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
