import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { translations } from './translations';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',

  resources: translations,
});

export default i18n;
