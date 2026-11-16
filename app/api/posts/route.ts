import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

import { firebaseStore } from '../../../lib/firebase';

const postsRef = collection(firebaseStore, 'articles');

export async function getPostsFirestore() {
  const querySnapshot = await getDocs(postsRef);
  const allArticles: unknown[] = [];
  querySnapshot.forEach((doc) => allArticles.push(doc.data()));
  return JSON.parse(JSON.stringify(allArticles));
}

export async function GET() {
  return NextResponse.json(await getPostsFirestore());
}

// Unimplemented verbs answer 405 automatically in the App Router, which is
// what the Pages version was faking after its handlers turned out not to exist.
