// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
vi.mock('../../wailsjs/go/services/TreeService', () => ({
  List: () => Promise.resolve(['a.txt'])
}));
import FileTree from '../FileTree';

/**
 * Tests for FileTree component ensure files load and selection works.
 */
describe('FileTree', () => {
  it('renders files from service', async () => {
    const onSelect = vi.fn();
    render(<FileTree repo="/repo" onSelect={onSelect} />);
    await waitFor(() => screen.getByText('a.txt'));
    fireEvent.click(screen.getByText('a.txt'));
    expect(onSelect).toHaveBeenCalledWith('a.txt');
  });
});
