import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Risk and Symptoms toggle buttons', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /risk/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /symptoms/i })).toBeInTheDocument();
});
