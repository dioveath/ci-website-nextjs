import { articleBodyToHtml } from '../editor/serialize';
import type { ArticleBody } from '../../types';

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

/*
 * Plain-text summary of an article body, in either stored format (legacy
 * EditorJS blocks or a Tiptap document). The previous version read
 * data.blocks directly, so it threw on Tiptap documents, and it returned raw
 * inline HTML which rendered as visible tags in the card.
 */
export function extractSummary(json: string | ArticleBody): string {
  const text = articleBodyToHtml(json)
    .replace(/<\/(p|h[1-6]|li|blockquote|pre)>/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, (m) => ENTITIES[m])
    .replace(/\s+/g, ' ')
    .trim();

  return text || ' ...(empty)';
}
