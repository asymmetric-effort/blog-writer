// Copyright (c) 2025 Sam Caldwell

// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import RepoWizard from './pages/RepoWizard';
import Modal from './components/Modal';
import MenuBar from './components/MenuBar';
import StatusBar from './components/StatusBar';
import FileTree from './components/FileTree';
import logo from './assets/images/logo-universal.png';

/**
 * App renders the WYSIWYG editor with a modal repo wizard.
 */
export default function App(): JSX.Element {
  const [showRepoWizard, setShowRepoWizard] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [repo, setRepo] = useState('');
  const [file, setFile] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setShowLogo(false), 15000);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = (p: string) => {
    setRepo(p);
    setShowRepoWizard(false);
  };

  return (
    <div id="App" className="app-window">
      <MenuBar />
      <div className="main-area">
        <div className="editor-container">
          <Editor />
        </div>
        <FileTree repo={repo} onSelect={setFile} />
      </div>
      <StatusBar repo={repo} file={file} wizardOpen={showRepoWizard} />
      <Modal open={showRepoWizard} title="Open/Create Blog Content Repository">
        {showLogo ? <img src={logo} alt="logo" /> : <RepoWizard onOpen={handleOpen} />}
      </Modal>
    </div>
  );
}
