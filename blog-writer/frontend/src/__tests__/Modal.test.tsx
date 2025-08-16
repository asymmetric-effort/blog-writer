// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Modal from '../components/Modal';

/**
 * Unit tests for the Modal component verifying stylistic requirements.
 */
describe('Modal', () => {
  it('applies an outset border and 10px offset shadow', () => {
    render(<Modal open>content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog.style.borderStyle).toBe('outset');
    expect(dialog.style.boxShadow.startsWith('10px 10px')).toBe(true);
  });
});
