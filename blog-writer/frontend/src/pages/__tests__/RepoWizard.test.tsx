// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
vi.mock('../../wailsjs/go/services/RepoService', () => ({
  Recent: () => Promise.resolve([{ path: 'r1', lastOpened: '2024-01-01T00:00:00Z' }]),
  Open: vi.fn().mockResolvedValue(undefined),
  Create: vi.fn()
}));
import RepoWizard from '../RepoWizard';

/**
 * RepoWizard interaction tests.
 */
describe('RepoWizard', () => {
  it('defaults to Open tab and opens repo on double click', async () => {
    const onOpen = vi.fn();
    render(<RepoWizard onOpen={onOpen} />);
    const row = await screen.findByText('r1');
    fireEvent.doubleClick(row);
    await waitFor(() => expect(onOpen).toHaveBeenCalledWith('r1'));
  });

  it('switches to Create tab', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByPlaceholderText('Repository Name')).toBeInTheDocument();
  });
});
