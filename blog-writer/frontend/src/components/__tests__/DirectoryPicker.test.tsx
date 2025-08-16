// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import DirectoryPicker from '../DirectoryPicker';

/**
 * Basic interaction test ensuring DirectoryPicker returns a directory path.
 */
describe('DirectoryPicker', () => {
  it('invokes onChange with selected path', () => {
    const onChange = vi.fn();
    const { container } = render(<DirectoryPicker onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    const file = new File(['content'], '/tmp/test/a.txt');
    Object.defineProperty(file, 'path', { value: '/tmp/test/a.txt' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith('/tmp/test');
  });

  it('handles Windows-style paths', () => {
    const onChange = vi.fn();
    const { container } = render(<DirectoryPicker onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    const file = new File(['content'], 'C:\\Users\\Alice\\repo\\a.txt');
    Object.defineProperty(file, 'path', { value: 'C:\\Users\\Alice\\repo\\a.txt' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith('C:\\Users\\Alice\\repo');
  });
});
