/**
 * Copyright 2024 Blog Writer
 */

import Ajv from 'ajv';
import schema from '../schema/article.schema.json' assert { type: 'json' };
import type { ArticleFile } from '../types/article';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile<ArticleFile>(schema);

export function validateArticle(data: unknown): asserts data is ArticleFile {
  const valid = validate(data);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
}
