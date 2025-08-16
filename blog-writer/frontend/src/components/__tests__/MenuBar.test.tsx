// Copyright (c) 2025 Sam Caldwell
/**
 * Tests for MenuBar component ensure all expected action buttons are rendered.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MenuBar, { actions } from '../MenuBar';

describe('MenuBar', () => {
  it('renders all action buttons with accessible labels', () => {
    render(<MenuBar />);
    actions.forEach(action => {
      expect(screen.getByLabelText(action.label)).toBeInTheDocument();
    });
  });
});
