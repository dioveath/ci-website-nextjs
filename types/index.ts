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
  /** JSON string holding a TiptapDoc. */
  body: string;
  createdAt: Timestamp | Date | string | null;
  heartsBy: Record<string, boolean>;
  thumbnail?: Thumbnail;
  likes: number;
  state: ArticleState;
}

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

export type ArticleBody = TiptapDoc | TiptapNode | null;

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
