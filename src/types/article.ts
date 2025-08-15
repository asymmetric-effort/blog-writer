/**
 * Copyright 2024 Blog Writer
 */

export interface ArticleMetadata {
  title: string;
  author?: string;
}

export interface BaseNode {
  tag: string;
}

export interface ContentNode extends BaseNode {
  content: string | Node[];
}

export interface ImageNode extends BaseNode {
  url: string;
}

export interface MathNode extends BaseNode {
  tex: string;
  display: boolean;
}

export type Node = ContentNode | ImageNode | MathNode;

export interface ArticleFile {
  version: string;
  metadata: ArticleMetadata;
  content: Node[];
}
