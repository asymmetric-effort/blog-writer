// Copyright (c) 2025 blog-writer authors
// SPDX-License-Identifier: MIT

import React from 'react';

/**
 * PathPicker renders a directory selector used by RepoWizard forms.
 */
interface PathPickerProps {
  /** Callback invoked with the selected path. */
  onChange: (path: string) => void;
}

export default function PathPicker({ onChange }: PathPickerProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // The first file's path includes the selected directory.
      const file = files[0] as File & { path?: string };
      const fullPath = file.path || '';
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      onChange(dir);
    }
  };

  return <input type="file" webkitdirectory="" onChange={handleChange} />;
}
