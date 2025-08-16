// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import RepoWizard from '../RepoWizard';

/**
 * RepoWizard interaction tests.
 */
describe('RepoWizard', () => {
  beforeEach(() => {
    const svc = (window as any).go.services.RepoService;
    svc.Recent.mockResolvedValue([{ path: 'r1', lastOpened: '2024-01-01T00:00:00Z' }]);
    svc.Open.mockResolvedValue(undefined);
    svc.Create.mockResolvedValue(undefined);
  });

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

  it('shows helpful hints on tabs', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    expect(screen.getByText(/Select or create/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText(/Choose a parent folder/)).toBeInTheDocument();
  });

  it('places SSH URL below file picker with create button below and right', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    fireEvent.click(screen.getByText('Create'));
    const boxes = screen.getAllByRole('textbox');
    expect(boxes[1]).toHaveAttribute('placeholder', 'SSH URL (optional)');
    const button = screen.getAllByText('Create')[1];
    const hint = screen.getByText(/Choose a parent folder/);
    expect(button.nextElementSibling).toBe(hint);
  });

  it('highlights tab on hover', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    const openTab = screen.getByText('Open');
    fireEvent.mouseEnter(openTab);
    expect(openTab).toHaveClass('hovered');
    fireEvent.mouseLeave(openTab);
    expect(openTab).not.toHaveClass('hovered');
  });

  it('has fixed dimensions', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    const wizard = screen.getByTestId('repo-wizard');
    expect(wizard).toHaveStyle({ width: '400px', height: '300px' });
  });

  it('styles tabs, picker, and help text correctly', () => {
    render(<RepoWizard onOpen={vi.fn()} />);
    const openTab = screen.getByText('Open');
    const createTab = screen.getByText('Create');
    expect(openTab).toHaveStyle('border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px;');
    expect(createTab).toHaveStyle('border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px;');
    expect(createTab).toHaveStyle('border-bottom: 1px solid black');
    const picker = screen.getAllByTestId('path-picker')[0];
    expect(picker).toHaveStyle({ height: '25px', marginTop: '20px' });
    const hint = screen.getByText(/Select or create/);
    expect(hint.parentElement?.lastElementChild).toBe(hint);
    fireEvent.click(createTab);
    expect(openTab).toHaveStyle('border-bottom: 1px solid black');
    const hintCreate = screen.getByText(/Choose a parent folder/);
    expect(hintCreate.parentElement?.lastElementChild).toBe(hintCreate);
  });

  it('renders five placeholders with consistent height when empty', async () => {
    const svc = (window as any).go.services.RepoService;
    svc.Recent.mockResolvedValue([]);
    render(<RepoWizard onOpen={vi.fn()} />);
    const rows = await screen.findAllByTestId('recent-row');
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      expect(cells[0].textContent).toBe('\u00A0');
      expect(cells[1].textContent).toBe('\u00A0');
    }
  });
});
