// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CurrentRepo from '../CurrentRepo';

/**
 * Tests for CurrentRepo component verifying repo and file fields.
 */
describe('CurrentRepo', () => {
  it('shows repository and file names with labels', () => {
    render(<CurrentRepo repo="/one" file="two.txt" />);
    expect(screen.getByText('Repo: one')).toBeInTheDocument();
    expect(screen.getByText('File: two.txt')).toBeInTheDocument();
  });

  it('indicates no file when none selected', () => {
    render(<CurrentRepo repo="/one" file="" />);
    expect(screen.getByText('File: <none>')).toBeInTheDocument();
  });

  it('separates fields by at least 10px', () => {
    const { getByTestId } = render(<CurrentRepo repo="/one" file="two" />);
    const container = getByTestId('current-repo');
    const styles = getComputedStyle(container);
    expect(parseInt(styles.columnGap)).toBeGreaterThanOrEqual(10);
  });
});
