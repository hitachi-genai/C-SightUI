import type { Preview } from '@storybook/react';
import { ThemeNames, ThemeTypes } from "@hitachi-genai/uikit-core";

import ThemeDecorator from './ThemeDecorator';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
  },
  decorators: [ThemeDecorator]
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        {
          value: `${ThemeNames.GenAI}-${ThemeTypes.Wicked}`,
          icon: 'circlehollow',
          title: 'GenAI theme - wicked',
        },
        {
          value: `${ThemeNames.GenAI}-${ThemeTypes.Dawn}`,
          icon: 'circlehollow',
          title: 'GenAI theme - dawn',
        },
      ],
      showName: true,
    },
  },
};

export default preview;
