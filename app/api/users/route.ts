import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

import { firebaseStore } from '../../../lib/firebase';

const usersRef = collection(firebaseStore, 'ci_users');

export async function getUsersFirestore() {
  const querySnapshot = await getDocs(usersRef);
  const allUsers: unknown[] = [];
  querySnapshot.forEach((doc) => allUsers.push(doc.data()));
  return JSON.parse(JSON.stringify(allUsers));
}

export async function GET() {
  return NextResponse.json(await getUsersFirestore());
}
