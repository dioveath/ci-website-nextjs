import type { Timestamp } from 'firebase/firestore';

/* ------------------------------------------------------------------ users -- */

/** A document in the `ci_users` Firestore collection. */
export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  profile_URL: string;
  cover_URL: string;
  address: string;
  phone_number: string;
  email: string;
  phone_verified: boolean;
  email_verified: boolean;
  exp_points: number;
  hearts: number;
  roles: Record<string, boolean>;
  profile_visits: number;
  /** courseId -> attendance bitstring, per the model in README.md */
  courses: Record<string, string>;
  medias: Media[];
  joined_at: number;
  on_board: boolean;
}

/** What the auth layer hands to UserService.addNewUser. */
export interface NewUserInput {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  photoURL?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

/* ------------------------------------------------------------------ media -- */

export interface Media {
  uid: string;
  downloadURL: string;
  name?: string;
  size?: number;
  contentType?: string;
  fullPath?: string;
}

export interface Thumbnail {
  id: string;
  downloadURL: string;
}

/* --------------------------------------------------------------- articles -- */

export type ArticleState = 'pending' | 'published' | 'rejected';

export interface Article {
  id: string;
  title: string;
  writtenBy: string;
  /** JSON string holding either a TiptapDoc or a legacy EditorJsDocument. */
  body: string;
  createdAt: Timestamp | Date | string | null;
  heartsBy: Record<string, boolean>;
  thumbnail?: Thumbnail;
  likes: number;
  state: ArticleState;
}

/** An article normalised for the blog list, which merges Firebase and Sanity. */
export type BlogSource = 'firebase' | 'sanity';

/* ---------------------------------------------------------- editor bodies -- */

export interface TiptapMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface TiptapNode {
  type?: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc extends TiptapNode {
  type: 'doc';
}

/** Legacy EditorJS output, still present on articles written before the swap. */
export interface EditorJsBlock {
  type: string;
  data: Record<string, any>;
}

export interface EditorJsDocument {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export type ArticleBody = TiptapDoc | TiptapNode | EditorJsDocument | null;

/* ---------------------------------------------------------------- courses -- */

export interface Course {
  id: string;
  title: string;
  level?: string;
  coverImg: string;
  description?: string;
  duration?: string;
  price?: string | number;
  /** Days; CourseCard renders this as months. */
  time?: number | string;
  lessons?: unknown[];
  [key: string]: unknown;
}

/* ------------------------------------------------------------ blog list -- */

/*
 * /blog merges Firebase user articles with Sanity editorial posts, so a card
 * receives one of two shapes discriminated by `source`. The index signature
 * keeps the merged list honest rather than pretending the two are identical.
 */
export interface BlogListItem {
  source?: BlogSource;
  id?: string;
  slug?: string;
  title: string;
  /** JSON string for Firebase articles; Portable Text blocks for Sanity posts. */
  body?: any;
  coverImg?: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  authorImage?: string;
  authorImg?: string;
  writtenBy?: string;
  thumbnail?: Thumbnail;
  createdAt?: unknown;
  publishedAt?: string;
  sortTime?: number;
  [key: string]: unknown;
}
