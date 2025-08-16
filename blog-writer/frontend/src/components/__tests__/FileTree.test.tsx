// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FileTree from '../FileTree';

/**
 * Tests for FileTree component ensure files load and selection works.
 */
describe('FileTree', () => {
  beforeEach(() => {
    (window as any).go.services.TreeService.List.mockResolvedValue(['a.txt']);
  });

  it('renders files from service', async () => {
    const onSelect = vi.fn();
    render(<FileTree repo="/repo" onSelect={onSelect} />);
    await waitFor(() => screen.getByText('a.txt'));
    fireEvent.click(screen.getByText('a.txt'));
    expect(onSelect).toHaveBeenCalledWith('a.txt');
  });

  it('renders even when no repository is open', () => {
    const onSelect = vi.fn();
    render(<FileTree repo="" onSelect={onSelect} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
