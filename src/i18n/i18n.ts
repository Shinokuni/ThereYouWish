import i18n from 'i18next';

import {initReactI18next} from 'react-i18next';
import translationsEN from './translations/en.json';
import translationsFR from './translations/fr.json';
import {getLocales} from 'react-native-localize';

const getDefaultLanguage = () => {
  const locales = getLocales();
  return locales[0].languageCode;
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationsEN,
    },
    fr: {
      translation: translationsFR,
    },
  },
  supportedLngs: ['en', 'fr'],
  lng: getDefaultLanguage(),
  fallbackLng: 'en',
});
