// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import DirectoryPicker from '../DirectoryPicker';

/**
 * Basic interaction test ensuring DirectoryPicker returns a directory path.
 */
describe('DirectoryPicker', () => {
  afterEach(() => {
    delete (window as any).runtime;
    delete (window as any).showDirectoryPicker;
  });
  it('returns path when showDirectoryPicker provides one', async () => {
    const onChange = vi.fn();
    (window as any).showDirectoryPicker = vi.fn().mockResolvedValue('/tmp/repo');
    const { getByRole } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button'));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('/tmp/repo'));
  });
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

  it('resolves file path via Wails runtime when missing', () => {
    const onChange = vi.fn();
    const resolve = vi.fn((files: File[]) => {
      Object.defineProperty(files[0], 'path', { value: '/tmp/test/a.txt', configurable: true });
    });
    (window as any).runtime = {
      CanResolveFilePaths: () => true,
      ResolveFilePaths: resolve,
    };
    const { container } = render(<DirectoryPicker onChange={onChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    const file = new File(['content'], 'a.txt');
    fireEvent.change(input, { target: { files: [file] } });
    expect(resolve).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('/tmp/test');
  });
});
