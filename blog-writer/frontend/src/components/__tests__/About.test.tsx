// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * About component should display application information and license text.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from '../About';

describe('About', () => {
  it('renders license information', () => {
    render(<About onClose={() => undefined} />);
    expect(screen.getByText('Blog Writer')).toBeInTheDocument();
    expect(screen.getByText(/MIT License/)).toBeInTheDocument();
  });
});
