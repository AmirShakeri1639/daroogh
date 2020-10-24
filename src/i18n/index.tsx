import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faResources from './fa/fa';
import enResources from './en/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ...faResources,
      ...enResources,
    },

    lng: localStorage.getItem('activeLang') || 'fa',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
