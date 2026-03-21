import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Risk and Symptoms toggle buttons', () => {
  render(<App />);
  expect(screen.getByText(/risk/i)).toBeInTheDocument();
  expect(screen.getByText(/symptoms/i)).toBeInTheDocument();
});
