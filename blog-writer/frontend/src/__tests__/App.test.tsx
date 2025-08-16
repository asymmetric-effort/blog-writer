// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';

/**
 * Render tests for the App component ensuring the RepoWizard appears as a modal.
 */
describe('App', () => {
  beforeEach(() => {
    const svc = (window as any).go.services.RepoService;
    svc.Recent.mockResolvedValue([]);
    svc.Open.mockResolvedValue(undefined);
    svc.Create.mockResolvedValue(undefined);
  });

  it('renders RepoWizard inside a modal dialog', () => {
    render(<App />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows RepoWizard after logo delay', async () => {
    vi.useFakeTimers();
    render(<App />);
    await act(async () => {
      vi.runAllTimers();
    });
    expect(screen.getByText('Open')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('keeps navigation pane on right when no repository open', () => {
    render(<App />);
    const tree = document.querySelector('.main-area .file-tree');
    expect(tree).not.toBeNull();
    expect(tree?.previousElementSibling?.className).toContain('editor-container');
  });

  it('shows repo wizard status message', () => {
    render(<App />);
    expect(screen.getByText('Open or create a blog content repository.')).toBeInTheDocument();
  });

  it('renders a centered modal title', () => {
    render(<App />);
    const title = screen.getByText('Open/Create Blog Content Repository');
    expect(title).toBeInTheDocument();
    expect(title).toHaveStyle({ textAlign: 'center' });
  });
});
