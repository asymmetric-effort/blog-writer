// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
vi.mock('../../wailsjs/go/services/RepoService', () => ({
  Recent: () => Promise.resolve(['r1']),
  Open: vi.fn(),
  Create: vi.fn()
}));
import RepoWizard from '../RepoWizard';

/**
 * RepoWizard interaction tests.
 */
describe('RepoWizard', () => {
  it('renders recent repos dropdown', async () => {
    const onOpen = vi.fn();
    render(<RepoWizard onOpen={onOpen} />);
    await waitFor(() => screen.getByText('r1'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'r1' } });
    expect(onOpen).toHaveBeenCalled();
  });
});
