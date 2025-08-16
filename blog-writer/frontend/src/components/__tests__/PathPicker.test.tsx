// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import PathPicker from '../PathPicker';

/**
 * Basic interaction test ensuring PathPicker returns a directory path.
 */
describe('PathPicker', () => {
  it('invokes onChange with selected path', () => {
    const onChange = vi.fn();
    const { container } = render(<PathPicker onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    const file = new File(['content'], '/tmp/test/a.txt');
    Object.defineProperty(file, 'path', { value: '/tmp/test/a.txt' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith('/tmp/test');
  });
});
