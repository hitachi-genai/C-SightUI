// Imports
import { screen, cleanup} from '@testing-library/react';
import { renderComponentWithProviders as render } from 'common/tests/renderWithProviders';

import App from './QuickInsightDashboard';

describe('Renders main page correctly', async () => {
  afterEach(() => {
    cleanup();
  });

  test('Should render total budget dashboard text', () => {
      render(<App />);
      const totalBudget =  screen.getByText(/Total budget available for entire cycle/i);
      expect(totalBudget).toBeInTheDocument();
  });

   test('Should render Total costs this cycle dashboard text', () => {
      render(<App />);
      const cycleCost =  screen.getByText('Total costs this cycle (staff & infrastructure)');
      expect(cycleCost).toBeInTheDocument();
  });

  test('Should render Total revenue produced this cycle dashboard text', () => {
      render(<App />);
      const revenue =  screen.getByText(/Total revenue produced this cycle/i);
      expect(revenue).toBeInTheDocument();
  });

  test('Should render Current balance this cycle dashboard text', () => {
      render(<App />);
      const balance =  screen.getByText(/Current balance this cycle/i);
      expect(balance).toBeInTheDocument();
  }); 

  test('Should render project timeline heading', () => {
      render(<App />);
      const timeline =  screen.getByText(/GenAI Project Timeline/i);
      expect(timeline).toBeInTheDocument();
  }); 

  test('Should show text Budget burn rate', () => {
      render(<App />);
      const burnRate =  screen.getByText(/Budget burn rate: Total costs/i);
      expect(burnRate).toBeInTheDocument();
  }); 
  test('Should show text Expected costs', () => {
      render(<App />);
      const expectedCosts =  screen.getByText(/Expected costs/i);
      expect(expectedCosts).toBeInTheDocument();
  }); 

  test('Should show text Observed costs', () => {
      render(<App />);
      const observedCosts =  screen.getByText(/Observed costs/i);
      expect(observedCosts).toBeInTheDocument();
  }); 
  
});
