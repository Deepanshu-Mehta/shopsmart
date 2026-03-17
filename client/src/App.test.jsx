import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the VESTIR storefront', () => {
    render(<App />);
    expect(screen.getAllByText('VESTIR')[0]).toBeInTheDocument();
  });
});
