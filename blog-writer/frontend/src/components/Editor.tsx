// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Editor provides a basic React Quill WYSIWYG editor for authoring blog content.
 */
export const Editor: React.FC = () => {
  const [value, setValue] = useState<string>('');
  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default Editor;
