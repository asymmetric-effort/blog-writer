/**
 * Copyright 2024 Blog Writer
 */

import React from 'react';
import katex from 'katex';

interface Props {
  tex: string;
  display: boolean;
}

export function MathBlock({ tex, display }: Props): JSX.Element {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false });
  return <span className="katex" dangerouslySetInnerHTML={{ __html: html }} />;
}
