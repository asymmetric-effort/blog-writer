// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';

/**
 * BugReport collects information required to file a GitHub issue.
 */
interface BugReportProps {
  /** Callback to close the BugReport dialog. */
  onClose: () => void;
}

export default function BugReport({ onClose }: BugReportProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`**Description**\n${description}\n\n**Steps to Reproduce**\n${steps}\n\n**Expected Behavior**\n${expected}\n\n**Actual Behavior**\n${actual}`);
    const url = `https://github.com/asymmetric-effort/blog-writer/issues/new?title=${encodeURIComponent(title)}&body=${body}`;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label>
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </label>
      <label>
        Steps to Reproduce
        <textarea value={steps} onChange={e => setSteps(e.target.value)} />
      </label>
      <label>
        Expected Behavior
        <textarea value={expected} onChange={e => setExpected(e.target.value)} />
      </label>
      <label>
        Actual Behavior
        <textarea value={actual} onChange={e => setActual(e.target.value)} />
      </label>
      <div style={buttonRow}>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </form>
  );
}

/** Form layout uses vertical stacking with spacing between fields. */
const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1rem',
  width: '400px'
};

/** buttonRow displays action buttons horizontally spaced. */
const buttonRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between'
};

