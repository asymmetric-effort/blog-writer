// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';

/** Directory node used by DirectoryTree. */
export interface DirNode {
  /** Full path to the directory. */
  path: string;
  /** Base name of the directory. */
  name: string;
  /** Child directories. */
  children: DirNode[];
}

/** Props for DirectoryTree component. */
interface DirectoryTreeProps {
  /** Nodes to render. */
  nodes: DirNode[];
  /** Currently selected path. */
  selected: string;
  /** Callback when a directory is chosen. */
  onSelect: (path: string) => void;
}

/**
 * DirectoryTree recursively renders directories as nested lists.
 */
export default function DirectoryTree({ nodes, selected, onSelect }: DirectoryTreeProps): JSX.Element {
  return (
    <ul>
      {nodes.map((n) => (
        <li key={n.path}>
          <button
            onClick={() => onSelect(n.path)}
            data-testid="dir-item"
            style={{ fontWeight: selected === n.path ? 'bold' : 'normal' }}
          >
            {n.name}
          </button>
          {n.children.length > 0 && (
            <DirectoryTree nodes={n.children} selected={selected} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
}

