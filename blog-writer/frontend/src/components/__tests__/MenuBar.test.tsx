// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * Tests for MenuBar component ensure all expected action buttons and help menu functionality.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import MenuBar, { actions } from '../MenuBar';

describe('MenuBar', () => {
  it('renders all action buttons with accessible labels', () => {
    render(<MenuBar />);
    actions.forEach(action => {
      expect(screen.getByLabelText(action.label)).toBeInTheDocument();
    });
  });

  it('shows help menu items when Help icon is clicked', async () => {
    render(<MenuBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByRole('menuitem', { name: 'About...' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Read the docs' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Report a bug' })).toBeInTheDocument();
  });

  it('opens Bug Reporting dialog', async () => {
    render(<MenuBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Report a bug' }));
    expect(screen.getByText('Bug Reporting')).toBeInTheDocument();
  });

  it('opens Documentation dialog', async () => {
    render(<MenuBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Read the docs' }));
    expect(screen.getByText('Blog Writer docs')).toBeInTheDocument();
  });

  it('opens About dialog', async () => {
    render(<MenuBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Help' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'About...' }));
    expect(screen.getByText('About Blog Writer')).toBeInTheDocument();
  });

  it('renders the Help button as an icon', () => {
    render(<MenuBar />);
    const helpButton = screen.getByRole('button', { name: 'Help' });
    expect(helpButton).not.toHaveTextContent('Help');
    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
  });
});
