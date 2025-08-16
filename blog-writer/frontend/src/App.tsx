// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';
import './App.css';
import Editor from './components/Editor';

/**
 * App renders the WYSIWYG editor once a repository is opened or created.
 */
function App(): JSX.Element {
  return (
    <div id="App">
      <Editor />
    </div>
  );
}

export default App;
