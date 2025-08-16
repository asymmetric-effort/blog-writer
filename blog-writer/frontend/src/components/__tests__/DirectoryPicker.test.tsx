// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import DirectoryPicker from '../DirectoryPicker';
import * as DirSvc from '../../../wailsjs/go/services/DirectoryService';

vi.mock('../../../wailsjs/go/services/DirectoryService');

/** Tests for the DirectoryPicker component. */
describe('DirectoryPicker', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('lists directories and selects path', async () => {
    (DirSvc.List as any).mockImplementation((p: string) => {
      if (!p) return Promise.resolve(['/home/user/a', '/home/user/b']);
      if (p === '/home/user/a') return Promise.resolve(['/home/user/a/sub']);
      return Promise.resolve([]);
    });
    const onChange = vi.fn();
    const { getByRole, getAllByTestId, getByText } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalled());
    const items = getAllByTestId('dir-item');
    fireEvent.click(items[0]);
    await waitFor(() => expect(DirSvc.List).toHaveBeenLastCalledWith('/home/user/a'));
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

  it('closes modal on escape key', async () => {
    (DirSvc.List as any).mockResolvedValue([]);
    const onChange = vi.fn();
    const { getByRole, queryByRole } = render(<DirectoryPicker onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: /browse/i }));
    await waitFor(() => expect(DirSvc.List).toHaveBeenCalled());
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });
});

