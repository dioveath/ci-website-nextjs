'use client';

import { articleBodyToHtml } from '../../lib/editor/serialize';
import type { ArticleBody } from '../../types';

// Server-renderable, so the body is in the initial HTML for crawlers.
export default function ArticleRenderer(
  { data, className = '' }: { data: string | ArticleBody; className?: string }
) {
  const html = articleBodyToHtml(data);
  if (!html) return null;

  return (
    <section
      className={`prose dark:prose-invert max-w-none ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
