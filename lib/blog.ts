/*
 * The public blog. Posts come from two places -- articles users write
 * (Firestore, published by an admin) and editorial posts (Sanity) -- and this
 * module is the only code that knows that. Pages get one post shape back.
 */

import { cache } from 'react';
import type { PortableTextBlock } from '@portabletext/types';

import { getArticle, listPublishedArticles } from './articles';
import { getUser } from './users';
import { articleSummary } from './editor/serialize';
import { getBlogPostBySlug, getBlogPosts } from './sanity/fetchers';
import type { Article, UserData } from '../types';

export interface BlogPost {
  source: 'firebase' | 'sanity';
  /** The /blog/[id] segment: a Firestore document id or a Sanity slug. */
  id: string;
  title: string;
  /** Plain text; empty when the post has nothing to summarise. */
  summary: string;
  coverImg: string | null;
  category: string;
  /** ISO 8601, or null when the source has no date. */
  publishedAt: string | null;
  author: { name: string; image: string | null; title: string };
}

export type BlogPostDetail =
  | (BlogPost & { source: 'firebase'; body: string; authorHearts: number })
  | (BlogPost & { source: 'sanity'; body: PortableTextBlock[] | null });

interface SanityPost {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImg?: string | null;
  authorName: string;
  authorImg?: string | null;
  category: string;
  publishedAt?: string | null;
  body?: PortableTextBlock[] | null;
}

function toIso(value: Article['createdAt']): string | null {
  if (!value) return null;
  const date = typeof value === 'object' && 'toDate' in value ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function fromArticle(article: Article, id: string, author: UserData | null): BlogPost {
  return {
    source: 'firebase',
    id,
    title: article.title,
    summary: articleSummary(article.body),
    coverImg: article.thumbnail?.downloadURL ?? null,
    category: 'Tech',
    publishedAt: toIso(article.createdAt),
    author: {
      name: author ? `${author.first_name} ${author.last_name}` : '',
      image: author?.profile_URL ?? null,
      title: (author as { rank?: string } | null)?.rank ?? '',
    },
  };
}

function fromSanity(post: SanityPost): BlogPost {
  return {
    source: 'sanity',
    id: post.slug,
    title: post.title,
    summary: post.excerpt ?? '',
    coverImg: post.coverImg ?? null,
    category: post.category,
    publishedAt: post.publishedAt ?? null,
    author: { name: post.authorName, image: post.authorImg ?? null, title: 'Charicha Team' },
  };
}

// Older articles can lack writtenBy, and a missing author must not take the
// post down with it.
function authorOf(article: Article): Promise<UserData | null> {
  return article.writtenBy ? getUser(article.writtenBy).catch(() => null) : Promise.resolve(null);
}

/** Every published post from both sources, newest first. */
export async function listPosts(): Promise<BlogPost[]> {
  const [articles, cmsPosts] = await Promise.all([
    listPublishedArticles().catch(() => []),
    getBlogPosts() as Promise<SanityPost[]>,
  ]);

  const authorIds = [...new Set(articles.map((a) => a.writtenBy).filter(Boolean))];
  const authors = new Map(await Promise.all(
    authorIds.map(async (uid) => [uid, await getUser(uid).catch(() => null)] as const)
  ));

  const posts = [
    ...articles.map((a) => fromArticle(a, a.id, authors.get(a.writtenBy) ?? null)),
    ...cmsPosts.map(fromSanity),
  ];
  const time = (p: BlogPost) => (p.publishedAt ? Date.parse(p.publishedAt) : 0);
  return posts.sort((a, b) => time(b) - time(a));
}

/**
 * A single post by its /blog/[id] segment: a Firestore article id first, then
 * a Sanity slug. Cached per request, so metadata and the page share one fetch.
 */
export const getPost = cache(async (id: string): Promise<BlogPostDetail | null> => {
  const article = await getArticle(id);
  if (article) {
    const author = await authorOf(article);
    return { ...fromArticle(article, id, author), source: 'firebase', body: article.body, authorHearts: author?.hearts ?? 0 };
  }

  const cmsPost = (await getBlogPostBySlug(id)) as SanityPost | null;
  if (cmsPost) return { ...fromSanity(cmsPost), source: 'sanity', body: cmsPost.body ?? null };

  return null;
});
