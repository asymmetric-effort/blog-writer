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

    it('positions FileTree on the left with fixed width', () => {
      render(<App />);
      const tree = document.querySelector('.main-area .file-tree') as HTMLElement;
      expect(tree).not.toBeNull();
      const editor = tree.nextElementSibling as HTMLElement;
      expect(editor.className).toContain('editor-container');
      const treeStyle = getComputedStyle(tree);
      expect(treeStyle.width).toBe('150px');
      expect(treeStyle.flexGrow).toBe('0');
      expect(treeStyle.flexShrink).toBe('0');
    });

  it('places FileTree flush below the menu bar', () => {
      render(<App />);
      const main = document.querySelector('.main-area') as HTMLElement;
      const style = getComputedStyle(main);
      expect(style.marginTop).toBe('0px');
    });

  it('allows the editor to grow and shrink with the window', () => {
      render(<App />);
      const editor = document.querySelector('.editor-container') as HTMLElement;
      const style = getComputedStyle(editor);
      expect(style.flexGrow).toBe('1');
      expect(style.flexShrink).toBe('1');
    });

  it('shows repo wizard status message', () => {
    render(<App />);
    expect(screen.getByText('Open or create a blog content repository.')).toBeInTheDocument();
  });

  it('expands the editor to the right edge', () => {
    render(<App />);
    const root = document.querySelector('.editor-container > div') as HTMLElement;
    const style = getComputedStyle(root);
    expect(style.width).toBe('100%');
  });

  it('renders a centered modal logo', () => {
    render(<App />);
    const overlay = screen.getByTestId('modal-overlay');
    expect(overlay).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('styles the modal overlay and title bar', () => {
    render(<App />);
    const overlay = screen.getByTestId('modal-overlay');
    expect(overlay).toHaveStyle({
      position: 'fixed',
      zIndex: '1000'
    });
    const header = screen.getByText('Repository Wizard');
    expect(header).toHaveStyle({
      backgroundColor: 'rgb(27, 38, 54)',
      color: 'rgb(255, 255, 255)'
    });
    expect((header as HTMLElement).style.borderBottom).toBe('');
  });
});
