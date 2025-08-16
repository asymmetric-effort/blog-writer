// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';
import './StatusBar.css';
import { normalizePath } from '../utils/normalizePath';

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
  const repoPath = repo ? normalizePath(repo) : '';
  const filePath = file ? normalizePath(file) : '';
  const text = wizardOpen
    ? 'Open or create a blog content repository.'
    : repo
    ? `${repoPath} - ${filePath}`
    : '';
  const style: React.CSSProperties = {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: 'Canvas',
    color: 'CanvasText',
    colorScheme: 'light dark',
    width: '100%',
  };
  return (
    <div className="status-bar" style={style}>
      {text}
    </div>
  );
}
