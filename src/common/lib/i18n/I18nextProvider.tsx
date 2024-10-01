import { I18nextProvider } from 'react-i18next';

import 'common/lib/dayjs/dayjs';
import i18n from './i18n';

function AppI18nextProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n} defaultNS="common">
      {children}
    </I18nextProvider>
  );
}

export default AppI18nextProvider;
