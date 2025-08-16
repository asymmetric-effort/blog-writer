// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT
/**
 * HelpIcon renders a blue circular icon with a white embossed question mark.
 */
import React from 'react';
import './HelpIcon.css';

/**
 * HelpIcon component used for the help menu button.
 *
 * @returns JSX.Element representing a help icon.
 */
export function HelpIcon(): JSX.Element {
  return <span className="help-icon" data-testid="help-icon" aria-hidden="true">?</span>;
}

export default HelpIcon;
