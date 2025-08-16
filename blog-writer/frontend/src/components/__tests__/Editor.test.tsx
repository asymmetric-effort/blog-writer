// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Editor from '../Editor';

/**
 * Render tests for the WYSIWYG editor.
 */
describe('Editor', () => {
  it('renders a textbox for content editing', () => {
    render(<Editor />);
    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });

  it('stretches to full height', () => {
    render(<Editor />);
    const wrapper = document.querySelector('.ql-container')?.parentElement as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '100%' });
  });
});
