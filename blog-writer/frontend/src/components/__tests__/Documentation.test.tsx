// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * Documentation component should display user guide text and close button.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Documentation from '../Documentation';

describe('Documentation', () => {
  it('renders user guide content', () => {
    render(<Documentation onClose={() => undefined} />);
    expect(screen.getByText(/User Guide/)).toBeInTheDocument();
  });
});
