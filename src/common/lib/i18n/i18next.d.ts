import { defaultNS } from 'common/lib/i18n/i18n';
import common from 'public/locales/en/common.json';

const resources = { common } as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources;
  }
}
