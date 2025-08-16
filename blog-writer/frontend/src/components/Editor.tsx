// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Disable the default Quill toolbar since controls live in MenuBar.
 */
const quillModules = { toolbar: false };

/**
 * Editor provides a basic React Quill WYSIWYG editor for authoring blog content.
 */
interface EditorProps {
  /** Currently opened repository path. */
  repo: string;
  /** Currently selected file path. */
  file: string;
}

export const Editor: React.FC<EditorProps> = ({ repo, file }) => {
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    setValue('');
  }, [repo, file]);
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={quillModules}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default Editor;
