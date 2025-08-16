// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from 'react';
import { List } from '../../wailsjs/go/services/TreeService';
import './FileTree.css';

/**
 * FileTree displays files for the selected repository and notifies on selection.
 */
interface FileTreeProps {
  /** Repository root path. */
  repo: string;
  /** Callback with chosen file path. */
  onSelect: (file: string) => void;
}

export default function FileTree({ repo, onSelect }: FileTreeProps): JSX.Element {
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    if (repo) {
      List(repo).then(setFiles);
    } else {
      setFiles([]);
    }
  }, [repo]);
  return (
    <ul className="file-tree">
      {files.map(f => (
        <li key={f}>
          <button onClick={() => onSelect(f)}>{f}</button>
        </li>
      ))}
    </ul>
  );
}
