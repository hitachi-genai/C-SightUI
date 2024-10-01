import { genAITheme, ThemeNames } from '@hitachi-genai/uikit-core';
import { HvProvider } from '@hitachivantara/uikit-react-core';
import I18nextProvider from 'common/lib/i18n';

function App() {
  return (
    <I18nextProvider>
      <HvProvider
        themes={[genAITheme]}
        theme={ThemeNames.GenAI}
        rootElementId="root"
        cssTheme="scoped"
      >
      </HvProvider>
    </I18nextProvider>
  );
}

export default App;
