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
  it('renders an editable content area', () => {
    render(<Editor />);
    const editor = document.querySelector('.ql-editor') as HTMLElement;
    expect(editor).toBeInTheDocument();
    expect(editor.getAttribute('contenteditable')).toBe('true');
  });

  it('stretches to full height', () => {
    render(<Editor />);
    const wrapper = document.querySelector('.ql-container')?.parentElement as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '100%' });
  });

  it('does not render a toolbar', () => {
    render(<Editor />);
    const toolbar = document.querySelector('.ql-toolbar');
    expect(toolbar).toBeNull();
  });
});
