// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
vi.mock('../../wailsjs/go/services/RepoService', () => ({
  Recent: () => Promise.resolve([]),
  Open: vi.fn(),
  Create: vi.fn()
}));
import App from '../App';

/**
 * Render tests for the App component ensuring the RepoWizard appears as a modal.
 */
describe('App', () => {
  it('renders RepoWizard inside a modal dialog', () => {
    render(<App />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // initial logo shown
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows RepoWizard after logo delay', async () => {
    vi.useFakeTimers();
    render(<App />);
    vi.advanceTimersByTime(15000);
    expect(await screen.findByText('Blog Repo Wizard')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
