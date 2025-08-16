// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';
import './CurrentRepo.css';
import { normalizePath } from '../utils/normalizePath';

/**
 * CurrentRepo displays the selected repository and file names.
 */
interface CurrentRepoProps {
  /** Path to the opened repository. */
  repo: string;
  /** Path to the opened file. */
  file: string;
}

export default function CurrentRepo({ repo, file }: CurrentRepoProps): JSX.Element {
  const repoPath = normalizePath(repo);
  const filePath = file ? normalizePath(file) : '<none>';
  const style: React.CSSProperties = { columnGap: '10px' };
  return (
    <div className="current-repo" data-testid="current-repo" style={style}>
      <span className="repo">Repo: {repoPath}</span>
      <span className="file">File: {filePath}</span>
    </div>
  );
}
