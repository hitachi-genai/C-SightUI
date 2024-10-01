// Imports
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderComponentWithProviders as render } from 'common/tests/renderWithProviders';

import App from '../App';

describe('Renders main page correctly', async () => {
  afterEach(() => {
    cleanup();
  });

  it('Should render the page correctly', async () => {
    await render(<App />);
    const h1 = await screen.findByText('genAI');

    expect(h1).toBeTruthy();
  });

  it('Should show the button count set to 0', async () => {
    await render(<App />);
    const button = await screen.queryByText('count-value: 0');

    expect(button).toBeTruthy();
  });

  it('Should show the button count set to 3', async () => {
    const user = userEvent.setup();

    await render(<App />);
    const button = await screen.queryByText('count-value: 0');

    expect(button).not.toBeNull();

    await user.click(button as HTMLElement);
    await user.click(button as HTMLElement);
    await user.click(button as HTMLElement);

    expect(button?.innerHTML).toBe('count-value: 3');
  });
});
