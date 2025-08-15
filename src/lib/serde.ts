/**
 * Copyright 2024 Blog Writer
 */

import { JSDOM } from 'jsdom';
import type { Node } from '../types/article';

function nodeFromElement(el: Element): Node {
  const tag = el.tagName.toLowerCase();
  if (tag === 'img') {
    return { tag, url: (el as HTMLImageElement).src };
  }
  if (tag === 'math') {
    return { tag: 'math', tex: el.textContent || '', display: el.getAttribute('display') === 'block' };
  }
  const children: Node[] = [];
  let textContent = '';
  el.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      textContent += child.textContent || '';
    } else if (child.nodeType === 1) {
      if (textContent) {
        children.push({ tag: 'span', content: textContent });
        textContent = '';
      }
      children.push(nodeFromElement(child as Element));
    }
  });
  if (textContent && children.length === 0) {
    return { tag, content: textContent } as Node;
  }
  if (textContent) {
    children.push({ tag: 'span', content: textContent });
  }
  return { tag, content: children.length ? children : '' } as Node;
}

export function fromHtml(html: string): Node[] {
  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  const nodes: Node[] = [];
  body.childNodes.forEach((child) => {
    if (child.nodeType === 1) nodes.push(nodeFromElement(child as Element));
  });
  return nodes;
}

function elementFromNode(node: Node, doc: Document): HTMLElement {
  const el = doc.createElement(node.tag);
  if ('url' in node) {
    (el as HTMLImageElement).src = node.url;
    return el;
  }
  if ('tex' in node) {
    el.textContent = node.tex;
    if (node.display) el.setAttribute('display', 'block');
    return el;
  }
  if (typeof node.content === 'string') {
    el.textContent = node.content;
  } else {
    node.content.forEach((child) => el.appendChild(elementFromNode(child, doc)));
  }
  return el;
}

export function toHtml(nodes: Node[]): string {
  const dom = new JSDOM('<!DOCTYPE html><body></body>');
  const body = dom.window.document.body;
  nodes.forEach((n) => body.appendChild(elementFromNode(n, dom.window.document)));
  return body.innerHTML;
}
