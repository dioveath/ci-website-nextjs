import { cache } from 'react';

import { getArticle, listPublishedArticles } from '../articles';
import { getUser } from '../users';
import { getBlogPosts, getBlogPostBySlug } from '../sanity/fetchers';
import { articleSummary } from '../editor/serialize';
import type { Article } from '../../types';

/** A Sanity `post` as projected by postsQuery / postBySlugQuery. */
interface SanityPost {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImg?: string | null;
  category?: string | null;
  authorName?: string | null;
  authorImg?: string | null;
  publishedAt?: string | null;
  body?: unknown;
}

/**
 * One shape for a blog card, whoever wrote the post.
 *
 * /blog merges two sources -- Firebase articles written in-app and Sanity
 * editorial posts -- which previously meant two card components and two
 * layouts that drifted apart. Normalising here leaves a single presentational
 * <BlogCard>.
 */
export interface BlogSummary {
  key: string;
  href: string;
  title: string;
  excerpt: string;
  coverImg: string;
  category: string;
  authorName: string;
  authorImg: string;
  /** ISO string, or null when the source has no usable date. */
  publishedAt: string | null;
  sortTime: number;
}

const FALLBACK_COVER = '/charichatower.jpg';
const FALLBACK_AVATAR = '/profile.jpg';

function trim(text: string, max = 180) {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}...`;
}

/** Firestore Timestamps, Dates and ISO strings all arrive here. */
function toMillis(value: unknown): number {
  if (!value) return 0;
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return Number((value as { seconds: number }).seconds) * 1000;
  }
  const ms = new Date(value as string | number | Date).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function toIso(ms: number): string | null {
  return ms > 0 ? new Date(ms).toISOString() : null;
}

/**
 * Resolves each author once.
 *
 * <BlogCard> used to fetch `/api/users/<id>` from inside every Firebase card,
 * so a list of N posts fired N requests from the browser after paint, and the
 * author name popped in late. Authors are looked up here instead, in parallel,
 * deduplicated by id.
 */
async function resolveAuthors(articles: Article[]) {
  const ids = [...new Set(articles.map((a) => a.writtenBy).filter(Boolean))];

  const entries = await Promise.all(
    ids.map(async (id) => {
      try {
        const userData = await getUser(id);
        if (!userData) return [id, null] as const;
        const name = [userData.first_name, userData.last_name].filter(Boolean).join(' ');
        return [id, { name: name || 'Charicha Student', img: userData.profile_URL }] as const;
      } catch {
        return [id, null] as const;
      }
    })
  );

  return new Map(entries);
}

function fromArticle(
  article: Article,
  authors: Map<string, { name: string; img: string } | null>
): BlogSummary {
  const author = authors.get(article.writtenBy) ?? null;
  const sortTime = toMillis(article.createdAt);

  // A body that fails to parse must not take the whole list down with it.
  let excerpt = '';
  try {
    excerpt = articleSummary(article.body);
  } catch {
    excerpt = '';
  }

  return {
    key: `firebase-${article.id}`,
    href: `/blog/${article.id}`,
    title: article.title,
    excerpt: trim(excerpt),
    coverImg: article.thumbnail?.downloadURL || FALLBACK_COVER,
    category: 'Student',
    authorName: author?.name ?? 'Charicha Student',
    authorImg: author?.img || FALLBACK_AVATAR,
    publishedAt: toIso(sortTime),
    sortTime
  };
}

function fromPost(post: SanityPost): BlogSummary {
  const sortTime = toMillis(post.publishedAt);

  return {
    key: `sanity-${post.slug}`,
    href: `/blog/${post.slug}`,
    title: post.title,
    excerpt: trim(post.excerpt ?? ''),
    coverImg: post.coverImg || FALLBACK_COVER,
    category: post.category || 'Tech',
    authorName: post.authorName || 'Charicha Institute',
    authorImg: post.authorImg || FALLBACK_AVATAR,
    publishedAt: toIso(sortTime),
    sortTime
  };
}

/** Both sources, newest first. Either one failing leaves the other intact. */
export async function getBlogSummaries(): Promise<BlogSummary[]> {
  const [articles, posts] = await Promise.all([
    listPublishedArticles().catch(() => [] as Article[]),
    getBlogPosts()
  ]);

  const authors = await resolveAuthors(articles);

  return [
    ...articles.map((article) => fromArticle(article, authors)),
    ...(posts as SanityPost[]).map((post) => fromPost(post))
  ].sort((a, b) => b.sortTime - a.sortTime);
}

/* ------------------------------------------------------------------ detail */

export interface BlogDetail extends BlogSummary {
  source: 'firebase' | 'sanity';
  /** A JSON string for Firebase articles; Portable Text blocks for Sanity. */
  body: unknown;
}

/**
 * Resolves one post from either source.
 *
 * /blog/<x> is a single route serving both a Firebase document id and a Sanity
 * slug, so the lookup tries the former and falls through to the latter. Both
 * come back in the one shape the page renders. Cached per request, so
 * generateMetadata and the page share one fetch instead of reading twice.
 */
export const getBlogDetail = cache(async (idOrSlug: string): Promise<BlogDetail | null> => {
  const article = await getArticle(idOrSlug).catch(() => null);
  if (article) {
    const authors = await resolveAuthors([article]);
    return { ...fromArticle(article, authors), source: 'firebase', body: article.body };
  }

  const post = await getBlogPostBySlug(idOrSlug);
  if (post) {
    return { ...fromPost(post as SanityPost), source: 'sanity', body: post.body };
  }

  return null;
});
