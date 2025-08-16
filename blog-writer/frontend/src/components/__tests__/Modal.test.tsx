// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Modal from '../Modal';
import { describe, it, expect } from 'vitest';

/**
 * Modal style tests.
 */
describe('Modal', () => {
  it('applies 5px border radius', () => {
    render(
      <Modal open title="t">
        <div>content</div>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ borderRadius: '5px' });
  });

  it('renders translucent backdrop when open', () => {
    render(
      <Modal open title="t">
        <div>content</div>
      </Modal>
    );
    const overlay = screen.getByTestId('modal-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' });
  });
});
