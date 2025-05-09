
import { render, screen } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard';
import { describe, it, expect } from 'vitest';

describe('Dashboard Component', () => {
  it('should render the Dashboard page', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Health Data Analytics/i)).toBeInTheDocument();
  });

  it('should display the Stats Overview', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Exploring public health trends/i)).toBeInTheDocument();
  });
});
