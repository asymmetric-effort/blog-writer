// Copyright (c) 2025 Sam Caldwell
/**
 * Tests for Grid component ensuring styling and layout expectations.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Grid from '../Grid';

/**
 * Verify grid styling such as borders, radius, and column widths.
 */
describe('Grid', () => {
  it('applies border, radius, and equal column widths with cell styles', () => {
    const headers = ['A', 'B'];
    const rows = [['1', '2']];
    render(<Grid headers={headers} rows={rows} dataTestId="grid" rowTestId="row" />);
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle({ borderStyle: 'outset', borderRadius: '5px' });

    const headerCells = screen.getAllByRole('columnheader');
    const dataCells = screen.getAllByRole('cell');

    headerCells.forEach(h => {
      expect(h).toHaveStyle({ backgroundColor: '#ddd', width: '50%', borderStyle: 'outset' });
    });
    dataCells.forEach(d => {
      expect(d).toHaveStyle({ backgroundColor: '#fff', borderStyle: 'inset' });
    });
  });
});
