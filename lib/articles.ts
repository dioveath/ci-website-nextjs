/*
 * User-written articles (the `articles` Firestore collection). New articles
 * start as 'pending'; an admin publishes them, and only published ones reach
 * the public blog.
 */

import {
  doc, deleteDoc, getDoc, getDocs, updateDoc, collection, query, where, setDoc,
  startAfter, orderBy, limit, type QueryConstraint
} from "firebase/firestore";

import { firebaseStore } from "./firebase";
import type { Article } from '../types';

const ARTICLES = "articles";

async function listWhere(...constraints: QueryConstraint[]): Promise<Article[]> {
  const snap = await getDocs(query(collection(firebaseStore, ARTICLES), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Article);
}

export async function getArticle(articleId?: string): Promise<Article | null> {
  if (!articleId) return null;
  try {
    const snap = await getDoc(doc(firebaseStore, ARTICLES, articleId));
    return snap.exists() ? (snap.data() as Article) : null;
  } catch (e) {
    // Drafts are readable only by their author and admins (firestore.rules):
    // to everyone else an unpublished article simply does not exist.
    if ((e as { code?: string })?.code === 'permission-denied') return null;
    throw e;
  }
}

/** Every article regardless of state, newest first (admin review). */
export function listAllArticles(): Promise<Article[]> {
  return listWhere(orderBy('createdAt', 'desc'), limit(100));
}

export function listPublishedArticles(): Promise<Article[]> {
  return listWhere(where('state', '==', 'published'), orderBy('createdAt', 'desc'), limit(100));
}

/** One page of an author's articles, newest first; pass the last article of the previous page to continue. */
export async function listArticlesByAuthor(userId?: string, after?: Article | null, pageSize = 10): Promise<Article[]> {
  if (!userId) return [];
  return listWhere(
    where('writtenBy', '==', userId),
    orderBy('createdAt', 'desc'),
    ...(after ? [startAfter(after.createdAt)] : []),
    limit(pageSize)
  );
}

export async function createArticle(data: Partial<Article>): Promise<string> {
  const ref = doc(collection(firebaseStore, ARTICLES));
  await setDoc(ref, {
    id: ref.id,
    title: data.title,
    writtenBy: data.writtenBy,
    body: data.body,
    createdAt: new Date(),
    heartsBy: {},
    thumbnail: data.thumbnail,
    likes: 0,
    state: 'pending'
  });
  return ref.id;
}

export async function updateArticle(articleId: string, data: Partial<Article>): Promise<void> {
  await updateDoc(doc(firebaseStore, ARTICLES, articleId), data);
}

export async function deleteArticle(articleId: string): Promise<void> {
  await deleteDoc(doc(firebaseStore, ARTICLES, articleId));
}
