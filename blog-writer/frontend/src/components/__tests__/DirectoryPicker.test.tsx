// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import DirectoryPicker from '../DirectoryPicker';
import * as DirSvc from '../../../wailsjs/go/services/DirectoryService';

vi.mock('../../../wailsjs/go/services/DirectoryService');

/** Tests for the DirectoryPicker component. */
describe('DirectoryPicker', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('lists directories as tree and selects path', async () => {
    (DirSvc.List as any).mockImplementation((p: string) => {
      if (!p) return Promise.resolve(['/home/user/a', '/home/user/b']);
      if (p === '/home/user/a') return Promise.resolve(['/home/user/a/sub']);
      return Promise.resolve([]);
    });
    const onChange = vi.fn();
    const { getByRole, getByText } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalledWith(''));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalledWith('/home/user/a'));
    expect(getByText('sub')).toBeInTheDocument();
    fireEvent.click(getByText('a'));
    fireEvent.click(getByText('Select'));
    expect(onChange).toHaveBeenCalledWith('/home/user/a');
  });

  it('creates new directory', async () => {
    (DirSvc.List as any).mockImplementation((p: string) => {
      if (!p) return Promise.resolve(['/tmp/sub']);
      return Promise.resolve([]);
    });
    const onChange = vi.fn();
    const { getByRole, getByPlaceholderText, getByTestId } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalled());
    (DirSvc.Create as any).mockResolvedValue(undefined);
    const input = getByPlaceholderText('New Directory');
    fireEvent.change(input, { target: { value: 'foo' } });
    fireEvent.click(getByTestId('create-btn'));
    await waitFor(() => expect(DirSvc.Create).toHaveBeenCalledWith('/tmp', 'foo'));
  });

  it('applies dark color scheme', async () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    (DirSvc.List as any).mockResolvedValue([]);
    const onChange = vi.fn();
    const { getByRole, getByTestId } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalled());
    const modal = getByTestId('modal');
    expect(modal).toHaveStyle({ background: 'rgb(51, 51, 51)', color: 'rgb(255, 255, 255)' });

  it('closes modal on escape key', async () => {
    (DirSvc.List as any).mockResolvedValue([]);
    const onChange = vi.fn();
    const { getByRole, queryByRole } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalled());
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());

  it('has 5px radius and bevelled outset border', () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DirectoryPicker onChange={onChange} />);
    const button = getByRole('button', { name: /browse/i });
    expect(button).toHaveStyle({ borderRadius: '5px', borderStyle: 'outset' });

    it('limits tree height and enables scrolling', async () => {
    (DirSvc.List as any).mockResolvedValue([]);
    const { getByRole, getByTestId } = render(<DirectoryPicker onChange={() => {}} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    const container = await waitFor(() => getByTestId('tree-container'));
    expect(container).toHaveStyle({ maxHeight: '500px', overflowY: 'auto' });

  });
});

