// Copyright (c) 2025 Sam Caldwell
// SPDX-License-Identifier: MIT

import React from 'react';

/**
 * About displays licensing and author information for Blog Writer.
 */
interface AboutProps {
  /** Callback to close the About dialog. */
  onClose: () => void;
}

export default function About({ onClose }: AboutProps): JSX.Element {
  return (
    <div style={containerStyle}>
      <h1>Blog Writer</h1>
      <p>This application is a static-content blog post authoring tool built by Sam Caldwell using Golang, Wails, ReactJS and TypeScript.  Please enjoy this tool and your freedom of expression.</p>
      <h2>MIT License</h2>
      <pre style={preStyle}>
(c) 2025 Asymmetric Effort, LLC.  &lt;scaldwell@asymmetric-effort.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
      </pre>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}

/** containerStyle formats the about content vertically. */
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '70vh',
  overflowY: 'auto',
  padding: '1rem',
  width: '600px'
};

/** preStyle preserves formatting for license text. */
const preStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap'
};

