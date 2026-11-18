/*
 * Article bodies: Tiptap/ProseMirror documents ({ type: 'doc', content: [...] })
 * stored in Firestore as JSON strings.
 *
 * They are turned into HTML by plain string building rather than by Tiptap's
 * generateHTML, which needs a DOM (and therefore happy-dom) on the server.
 * Keeping it string-based means the blog can server-render article bodies for
 * SEO with no extra dependency. The output is safe by construction: only nodes
 * from our schema are emitted, text is escaped and URLs are allow-listed.
 */

import type { ArticleBody, TiptapNode } from '../../types';

const VOID = new Set(['br', 'hr', 'img']);

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(url: unknown): string {
  const trimmed = String(url ?? '').trim();
  return /^(https?:|mailto:|\/)/i.test(trimmed) ? escapeHtml(trimmed) : '';
}

function el(tag: string, attrs?: Record<string, unknown> | null, inner?: string): string {
  const a = Object.entries(attrs || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
    .join('');
  return VOID.has(tag) ? `<${tag}${a}>` : `<${tag}${a}>${inner ?? ''}</${tag}>`;
}

const MARK_TAG: Record<string, string> = {
  bold: 'strong', italic: 'em', strike: 's', underline: 'u',
  code: 'code', highlight: 'mark'
};

function textNode(node: TiptapNode): string {
  let html = escapeHtml(node.text);
  for (const mark of [...(node.marks || [])].reverse()) {
    if (mark.type === 'link') {
      const href = safeUrl(mark.attrs?.href);
      html = href ? `<a href="${href}" rel="noopener noreferrer nofollow">${html}</a>` : html;
    } else if (MARK_TAG[mark.type]) {
      html = `<${MARK_TAG[mark.type]}>${html}</${MARK_TAG[mark.type]}>`;
    }
  }
  return html;
}

function nodeToHtml(node?: TiptapNode): string {
  if (!node || typeof node !== 'object') return '';
  const kids = () => (node.content || []).map(nodeToHtml).join('');

  switch (node.type) {
    case 'doc':            return kids();
    case 'text':           return textNode(node);
    case 'paragraph':      return el('p', null, kids());
    case 'heading':        return el(`h${Math.min(Math.max(node.attrs?.level || 2, 1), 6)}`, null, kids());
    case 'bulletList':     return el('ul', null, kids());
    case 'orderedList':    return el('ol', { start: node.attrs?.start > 1 ? node.attrs?.start : undefined }, kids());
    case 'listItem':       return el('li', null, kids());
    case 'taskList':       return el('ul', { 'data-type': 'taskList' }, kids());
    case 'taskItem':       return el('li', { 'data-type': 'taskItem', 'data-checked': node.attrs?.checked ? 'true' : 'false' }, kids());
    case 'blockquote':     return el('blockquote', null, kids());
    case 'codeBlock':      return el('pre', null, el('code', { class: node.attrs?.language ? `language-${node.attrs.language}` : undefined }, escapeHtml((node.content || []).map((c: TiptapNode) => c.text || '').join(''))));
    case 'horizontalRule': return el('hr');
    case 'hardBreak':      return el('br');
    case 'image':          return safeUrl(node.attrs?.src) ? el('img', { src: safeUrl(node.attrs?.src), alt: node.attrs?.alt || '', title: node.attrs?.title || undefined, loading: 'lazy' }) : '';
    case 'table':          return el('table', null, kids());
    case 'tableRow':       return el('tr', null, kids());
    case 'tableCell':      return el('td', { colspan: node.attrs?.colspan, rowspan: node.attrs?.rowspan }, kids());
    case 'tableHeader':    return el('th', { colspan: node.attrs?.colspan, rowspan: node.attrs?.rowspan }, kids());
    default:               return kids();
  }
}

/** Accepts the stored JSON string or an already-parsed document. */
export function articleBodyToHtml(body: string | ArticleBody): string {
  let doc: unknown = body;
  if (typeof body === 'string') {
    try { doc = JSON.parse(body); } catch { return ''; }
  }
  return nodeToHtml(doc as TiptapNode);
}

export function isEmptyDocument(doc: ArticleBody): boolean {
  return articleBodyToHtml(doc).replace(/<[^>]*>/g, '').trim().length === 0;
}

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

/** Plain-text summary of an article body, for cards and link previews. */
export function articleSummary(body: string | ArticleBody): string {
  const text = articleBodyToHtml(body)
    .replace(/<\/(p|h[1-6]|li|blockquote|pre)>/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, (m) => ENTITIES[m])
    .replace(/\s+/g, ' ')
    .trim();

  return text || ' ...(empty)';
}
