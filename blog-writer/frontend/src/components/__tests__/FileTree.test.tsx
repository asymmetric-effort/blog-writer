// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '@testing-library/jest-dom/vitest';
import FileTree from '../FileTree';

/**
 * Tests for FileTree component ensure files load, selection works, and styles follow the system theme.
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

  it('shows repository icon when no repository is open', () => {
    render(<FileTree repo="" onSelect={() => {}} />);
    expect(screen.getByLabelText('repository')).toBeInTheDocument();
  });

  it('limits its height to available space', () => {
    const { container } = render(<FileTree repo="" onSelect={() => {}} />);
    const list = container.querySelector('.file-tree') as HTMLElement;
    expect(list).toHaveStyle('height: 100%');
  });

  it('uses the system background and a right border', () => {
    const cssPath = join(dirname(fileURLToPath(import.meta.url)), '../FileTree.css');
    const css = readFileSync(cssPath, 'utf8');
    expect(css).toMatch(/background-color:\s*Canvas;/);
    expect(css).toMatch(/border-right:\s*2px\s+outset;/);
    const { container } = render(<FileTree repo="" onSelect={() => {}} />);
    const list = container.querySelector('.file-tree') as HTMLElement;
    expect(list).toBeInTheDocument();
  });
});
