import dayjs from 'dayjs';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { DateFormatOptions } from './types';

export const defaultNS = 'common';

const i18nInstance = i18next.createInstance();

i18nInstance
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: `${import.meta.env.VITE_LOCALES_URL}/{{lng}}/{{ns}}.json`,
    },
  });

i18nInstance.services.formatter?.add(
  'formatDate',
  (value, lng, options: DateFormatOptions) => {
    if (lng) {
      return dayjs(value)
        .locale(lng)
        .format(options?.format);
    }
    return dayjs(value).format(options?.format);
  },
);

export default i18nInstance;
