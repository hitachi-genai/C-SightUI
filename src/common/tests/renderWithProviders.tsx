/* eslint-disable react-refresh/only-export-components */
import { genAITheme, ThemeNames } from '@hitachi-genai/uikit-core';
import { HvProvider } from '@hitachivantara/uikit-react-core';
import { render, renderHook, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AllProviders({ children }: Props) {
  return (
    <HvProvider
      themes={[genAITheme]}
      theme={ThemeNames.GenAI}
      rootElementId="root"
      cssTheme="scoped"
    >
      {children}
    </HvProvider>
  );
}

export function renderComponentWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export function renderHookWithProviders<T>(hookFn: () => T) {
  return renderHook(() => hookFn(), {
    wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
  });
}
