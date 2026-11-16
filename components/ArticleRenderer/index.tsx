'use client';

import { articleBodyToHtml } from '../../lib/editor/serialize';
import type { ArticleBody } from '../../types';

/*
 * Renders an article body in either stored format (legacy EditorJS blocks or a
 * Tiptap document). Serialisation is pure string building, so unlike the old
 * EditorJSRenderer -- which had to be dynamically imported with ssr:false --
 * this renders on the server and the body is in the initial HTML for crawlers.
 *
 * The markup is safe by construction: Tiptap documents can only contain nodes
 * from our schema, and legacy inline HTML goes through an allow-list.
 */
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
