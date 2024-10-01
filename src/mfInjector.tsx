import { createRoot } from 'react-dom/client';

import App from './App/App';

function mfInjector(parentElementId: string) {
  const container = document.getElementById(parentElementId);
  if (!container) {
    throw new Error(`Cannot find element with id ${parentElementId}`);
  }
  const root = createRoot(container);
  return {
    inject: () => root.render(<App />),
    unmount: () => root.unmount(),
  };
}

export default mfInjector;
