/**
 * Copyright 2024 Blog Writer
 */

import React, { useState } from 'react';

interface Props {
  status: string;
  onCommit(message: string): void;
}

export function GitPanel({ status, onCommit }: Props): JSX.Element {
  const [message, setMessage] = useState('');
  return (
    <div>
      <pre>{status || 'clean'}</pre>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => onCommit(message)}>Commit</button>
    </div>
  );
}
