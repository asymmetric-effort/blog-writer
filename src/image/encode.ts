/**
 * Copyright 2024 Blog Writer
 */

export function encodeSvg(svg: string): string {
  const base64 = Buffer.from(svg, 'utf8').toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
