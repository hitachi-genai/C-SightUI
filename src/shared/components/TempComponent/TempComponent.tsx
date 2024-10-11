import { HvContainer, theme } from '@hitachivantara/uikit-react-core';
import { useTranslation } from 'react-i18next';

import { Header } from '../Header';

/**
 * TempComponent component.
 * Test component, will be removed.
 */
function TempComponent() {
  // const [count, setCount] = useState<number>(0);
  const { t, i18n } = useTranslation();
  // const onClick = () => {
  //   setCount((prevState) => prevState + 1);
  // };
  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div style={{ height: '50vh' }}>
      <Header />
      <HvContainer
        component="main"
        maxWidth="lg"
      >
        {/* <h1>{t('genAI')}</h1> */}
        {/* <button type="button" onClick={onClick}>
          {t('count-value')}: {count}
        </button> */}
        {/* <button type="button" onClick={changeLanguage}>
          {t('change-language')}
        </button> */}
        {/* <p>{t('current-date', { value: Date.now() })}</p> */}
      </HvContainer>
    </div>
  );
}

export default TempComponent;
