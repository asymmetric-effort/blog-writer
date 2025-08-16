// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import StatusBar from '../StatusBar';

/**
 * Render tests for StatusBar component.
 */
describe('StatusBar', () => {
  it('shows current repository information when open', () => {
    render(<StatusBar repo="/repo" file="note.txt" wizardOpen={false} />);
    expect(screen.getByText('Repo: repo')).toBeInTheDocument();
    expect(screen.getByText('File: note.txt')).toBeInTheDocument();
  });

  it('shows repo wizard hint when open', () => {
    render(<StatusBar repo="" file="" wizardOpen />);
    expect(screen.getByText('Open or create a blog content repository.')).toBeInTheDocument();
  });

  it('uses system fonts and colors', () => {
    const { container } = render(<StatusBar repo="" file="" wizardOpen={false} />);
    const bar = container.querySelector('.status-bar') as HTMLElement;
    const styles = getComputedStyle(bar);
    expect(styles.fontFamily.toLowerCase()).toContain('system-ui');
    expect(styles.backgroundColor).not.toBe('');
  });

  it('renders an outset top border', () => {
    const { container } = render(<StatusBar repo="" file="" wizardOpen={false} />);
    const bar = container.querySelector('.status-bar') as HTMLElement;
    const styles = getComputedStyle(bar);
    expect(styles.borderTopStyle).toBe('outset');
  });
});
