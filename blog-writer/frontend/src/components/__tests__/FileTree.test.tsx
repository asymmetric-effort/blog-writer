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

  it('updates when repository is opened', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<FileTree repo="" onSelect={onSelect} />);
    expect(screen.queryByText('a.txt')).toBeNull();
    rerender(<FileTree repo="/repo" onSelect={onSelect} />);
    await waitFor(() => screen.getByText('a.txt'));
  });

  it('renders even when no repository is open', () => {
    const onSelect = vi.fn();
    render(<FileTree repo="" onSelect={onSelect} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('shows repository icon when no repository is open', () => {
    render(<FileTree repo="" onSelect={() => {}} />);
    expect(screen.getByLabelText('repository')).toBeInTheDocument();
  });

  it('limits its height to available space', () => {
    const { container } = render(<FileTree repo="" onSelect={() => {}} />);
    const list = container.querySelector('.file-tree') as HTMLElement;
    expect(list).toHaveStyle('height: 100%');
  });

  it('positions root node 5px from left edge', () => {
    const { container } = render(<FileTree repo="" onSelect={() => {}} />);
    const list = container.querySelector('.file-tree') as HTMLElement;
    const style = getComputedStyle(list);
    expect(style.paddingLeft).toBe('5px');
  });

  it('aligns top edge with menu bar', () => {
    const { container } = render(<FileTree repo="" onSelect={() => {}} />);
    const list = container.querySelector('.file-tree') as HTMLElement;
    const style = getComputedStyle(list);
    expect(style.marginTop).toBe('0px');
  });
});
