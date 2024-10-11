import { HvProvider } from '@hitachivantara/uikit-react-core';
import { genAITheme } from '@hitachi-genai/uikit-core';
import { Decorator } from '@storybook/react';


export const ThemeDecorator: Decorator = (story, context) => {
  const { theme = '' } = context.globals;
  const [themeName, colorMode] = theme.split('-');

  return (
    <HvProvider themes={[genAITheme]} theme={themeName} colorMode={colorMode}>
      {story()}
    </HvProvider>
  );
};

export default ThemeDecorator;
