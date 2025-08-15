/**
 * Copyright 2024 Blog Writer
 */

const SCRIPT_TAG = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const FOREIGN_OBJECT_TAG = /<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi;

export function sanitizeSvg(svg: string): string {
  return svg.replace(SCRIPT_TAG, '').replace(FOREIGN_OBJECT_TAG, '');
}
