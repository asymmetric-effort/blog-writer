// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * Tests for BugReport ensure all form fields render and submission opens GitHub.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BugReport from '../BugReport';

describe('BugReport', () => {
  it('renders required form fields', () => {
    render(<BugReport onClose={() => undefined} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Steps to Reproduce')).toBeInTheDocument();
  });

  it('opens GitHub issue page on submit', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<BugReport onClose={() => undefined} />);
    await userEvent.type(screen.getByLabelText('Title'), 'bug');
    await userEvent.type(screen.getByLabelText('Description'), 'desc');
    await userEvent.click(screen.getByText('Submit'));
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
