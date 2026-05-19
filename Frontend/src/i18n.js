/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: i18n
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio i18n
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  es: {
    translation: translationES
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'es', // Idioma por defecto o guardado
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React ya escapa por defecto contra XSS
    }
  });

export default i18n;
