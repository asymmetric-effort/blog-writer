// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import StatusBar from '../StatusBar';

/**
 * Render tests for StatusBar component.
 */
describe('StatusBar', () => {
  it('shows repository and file info', () => {
    render(<StatusBar repo="/repo" file="file.txt" />);
    expect(screen.getByText('/repo - file.txt')).toBeInTheDocument();
  });
});
