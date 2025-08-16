// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';
import './StatusBar.css';

/**
 * StatusBar displays the current repository and file being edited.
 */
interface StatusBarProps {
  /** Selected repository path. */
  repo: string;
  /** Selected file name. */
  file: string;
}

export default function StatusBar({ repo, file }: StatusBarProps): JSX.Element {
  return <div className="status-bar">{repo && `${repo} - ${file}`}</div>;
}
