/**
 * Copyright 2024 Blog Writer
 */

import React, { useEffect, useRef } from 'react';
import type { ArticleFile } from '../../types/article';
import { fromHtml, toHtml } from '../../lib/serde';

interface Props {
  article: ArticleFile;
  onChange(article: ArticleFile): void;
}

export function Editor({ article, onChange }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = toHtml(article.content);
    }
  }, [article]);

  const handleInput = (): void => {
    if (ref.current) {
      const nodes = fromHtml(ref.current.innerHTML);
      onChange({ ...article, content: nodes });
    }
  };

  return <div ref={ref} contentEditable onInput={handleInput} />;
}
