// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';
import userGuide from '../../../../docs/user-guide.md?raw';

/**
 * Documentation displays user documentation in a scrollable view.
 */
interface DocumentationProps {
  /** Callback to close the documentation dialog. */
  onClose: () => void;
}

export default function Documentation({ onClose }: DocumentationProps): JSX.Element {
  return (
    <div style={containerStyle}>
      <pre style={preStyle}>{userGuide}</pre>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}

/** containerStyle constrains height and enables vertical scrolling. */
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '70vh',
  overflowY: 'auto',
  padding: '1rem',
  width: '600px'
};

/** preStyle ensures whitespace is preserved for markdown text. */
const preStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap'
};

