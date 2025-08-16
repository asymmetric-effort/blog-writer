// Copyright (c) 2024 blog-writer authors
// Type definitions for blog articles.

/** Metadata about an article. */
export interface Metadata {
  title: string;
  author: string;
  description: string;
  publicationDate: string; // RFC3339
  updatedDate: string; // RFC3339
  keywords: string[];
}

/** Inline or block node in an article document. */
export type Node =
  | HeadingNode
  | ParagraphNode
  | SpanNode
  | EmphasisNode
  | BreakNode
  | MathNode
  | ImageNode
  | QuoteNode
  | ListNode
  | ListItemNode
  | CodeBlockNode
  | HrNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | ContainerNode
  | TimeNode;

export interface NodeBase {
  tag: string;
}

export interface HeadingNode extends NodeBase {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  content: Node[];
}

export interface ParagraphNode extends NodeBase {
  tag: 'p';
  content: Node[];
}

export interface SpanNode extends NodeBase {
  tag: 'span';
  content: string;
}

export interface EmphasisNode extends NodeBase {
  tag:
    | 'b'
    | 'i'
    | 'u'
    | 'strong'
    | 'em'
    | 'code'
    | 'sub'
    | 'sup'
    | 's'
    | 'mark'
    | 'small';
  content: Node[] | string;
}

export interface BreakNode extends NodeBase {
  tag: 'br';
}

export interface MathNode extends NodeBase {
  tag: 'math';
  mode: 'inline' | 'display';
  content: string;
  numbered?: boolean;
  label?: string;
}

export interface ImageNode extends NodeBase {
  tag: 'img';
  url: string; // data URI for SVG
  alt?: string;
}

export interface QuoteNode extends NodeBase {
  tag: 'blockquote';
  content: Node[];
}

export interface ListNode extends NodeBase {
  tag: 'ol' | 'ul';
  start?: number;
  content: ListItemNode[];
}

export interface ListItemNode extends NodeBase {
  tag: 'li';
  content: Node[];
}

export interface CodeBlockNode extends NodeBase {
  tag: 'pre';
  lang?: string;
  content: string;
}

export interface HrNode extends NodeBase {
  tag: 'hr';
}

export interface TableNode extends NodeBase {
  tag: 'table';
  content: TableRowNode[];
}

export interface TableRowNode extends NodeBase {
  tag: 'tr';
  content: TableCellNode[];
}

export interface TableCellNode extends NodeBase {
  tag: 'th' | 'td';
  content: Node[];
}

export interface ContainerNode extends NodeBase {
  tag:
    | 'header'
    | 'footer'
    | 'main'
    | 'section'
    | 'article'
    | 'aside'
    | 'nav'
    | 'figure'
    | 'figcaption';
  content: Node[];
}

export interface TimeNode extends NodeBase {
  tag: 'time';
  datetime?: string;
  content: Node[];
}

/** Complete article file. */
export interface Article {
  version: string;
  metadata: Metadata;
  document: Node[];
}

