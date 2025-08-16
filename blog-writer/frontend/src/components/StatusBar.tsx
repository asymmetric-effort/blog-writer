// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';
import './StatusBar.css';
import CurrentRepo from './CurrentRepo';

/**
 * StatusBar displays the current repository and file being edited.
 */
interface StatusBarProps {
  /** Selected repository path. */
  repo: string;
  /** Selected file name. */
  file: string;
  /** True when the repository wizard is visible. */
  wizardOpen: boolean;
}

export default function StatusBar({ repo, file, wizardOpen }: StatusBarProps): JSX.Element {
  const style: React.CSSProperties = {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: 'Canvas',
    color: 'CanvasText',
    colorScheme: 'light dark',
    borderTop: '1px outset',
    width: '100%',
  };
  return (
    <div className="status-bar" style={style}>
      {wizardOpen ? (
        'Open or create a blog content repository.'
      ) : repo ? (
        <CurrentRepo repo={repo} file={file} />
      ) : (
        ''
      )}
    </div>
  );
}
