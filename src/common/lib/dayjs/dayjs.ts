import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ja';

import i18next from '../i18n/i18n';

dayjs.extend(localizedFormat);
dayjs.extend(localeData);
i18next.on('languageChanged', (lng) => dayjs.locale(lng));
