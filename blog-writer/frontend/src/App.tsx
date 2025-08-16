// Copyright (c) 2025 Sam Caldwell

// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import RepoWizard from './pages/RepoWizard';
import Modal from './components/Modal';
import MenuBar from './components/MenuBar';

/**
 * App renders the WYSIWYG editor with a modal repo wizard.
 */
export default function App(): JSX.Element {
  const [showRepoWizard] = useState(true);

  return (
    <div id="App">
      <div>
        <MenuBar />
      </div>
      <div>
      <Editor />
      </div>
      <div>
          /* The status bar goes here */
      </div>
      <Modal open={showRepoWizard}>
        <RepoWizard />
      </Modal>
    </div>
  );
}
