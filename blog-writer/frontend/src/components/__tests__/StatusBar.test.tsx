// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import StatusBar from '../StatusBar';
import { normalizePath } from '../../utils/normalizePath';

/**
 * Render tests for StatusBar component.
 */
describe('StatusBar', () => {
  it('shows repository and file info using host path separators', () => {
    const repo = 'one/two\\three';
    const file = 'sub\\file.txt';
    const expected = `${normalizePath(repo)} - ${normalizePath(file)}`;
    render(<StatusBar repo={repo} file={file} wizardOpen={false} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('shows repo wizard hint when open', () => {
    render(<StatusBar repo="" file="" wizardOpen />);
    expect(screen.getByText('Open or create a blog content repository.')).toBeInTheDocument();
  });
});
