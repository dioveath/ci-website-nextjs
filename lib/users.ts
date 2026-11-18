/*
 * User profiles (the `ci_users` Firestore collection) and the media each user
 * uploads to Storage. Media lives on the user document, so uploads and deletes
 * keep Storage and Firestore in step here rather than in callers.
 */

import { doc, setDoc, getDoc, getDocs, updateDoc, collection, query, limit, arrayUnion, arrayRemove, orderBy } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL, deleteObject } from 'firebase/storage';

import { firebaseStore, firebaseStorage } from "./firebase";
import type { Media, NewUserInput, UserData } from '../types';

const USERS = "ci_users";
const DEFAULT_AVATAR_LINK =
  "https://firebasestorage.googleapis.com/v0/b/ciapp-34d14.appspot.com/o/profile%2FCI_Logo_Graphic_512.png?alt=media&token=b4394411-5726-4f77-b0b9-971228aa4521";

const userRef = (userId: string) => doc(firebaseStore, USERS, userId);
const imageRef = (uid: string) => ref(firebaseStorage, `images/${uid}`);

export async function getUser(userId: string): Promise<UserData | null> {
  const snap = await getDoc(userRef(userId));
  return snap.exists() ? (snap.data() as UserData) : null;
}

export async function listUsers(): Promise<UserData[]> {
  const q = query(collection(firebaseStore, USERS), orderBy('joined_at', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserData);
}

export async function createUser(input: NewUserInput): Promise<void> {
  const { id, firstName, lastName, photoURL, email, phoneNumber } = input;
  if (!id) throw new Error("id is required!");

  const user: UserData = {
    id,
    first_name: firstName ?? "",
    last_name: lastName ?? "",
    profile_URL: photoURL ?? DEFAULT_AVATAR_LINK,
    cover_URL: "",
    address: "",
    phone_number: phoneNumber ?? "0000000000",
    email: email ?? "",
    phone_verified: false,
    email_verified: false,
    exp_points: 0,
    hearts: 0,
    roles: { guest: true },
    profile_visits: 0,
    courses: {},
    medias: [],
    joined_at: Date.now(),
    on_board: false
  };

  await setDoc(userRef(id), user);
}

export async function updateUser(userId: string, data: Partial<UserData>): Promise<void> {
  await updateDoc(userRef(userId), data);
}

function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<Media> {
  if (!file.type.startsWith('image/')) return Promise.reject(new Error('Only images can be uploaded.'));

  const uid = crypto.randomUUID();
  const meta = { contentType: file.type, name: file.name, size: file.size };
  const task = uploadBytesResumable(imageRef(uid), file, { contentType: file.type });

  return new Promise<Media>((resolve, reject) => {
    task.on('state_changed',
      (s) => onProgress?.((s.bytesTransferred / s.totalBytes) * 100),
      reject,
      () => getDownloadURL(task.snapshot.ref).then((downloadURL) => resolve({ downloadURL, uid, ...meta }), reject));
  });
}

/** Uploads an image and records it on the user. Rolls the upload back if recording fails. */
export async function addMedia(userId: string, file: File, onProgress?: (percent: number) => void): Promise<Media> {
  const media = await uploadImage(file, onProgress);
  try {
    await updateDoc(userRef(userId), { medias: arrayUnion(media) });
    return media;
  } catch (e) {
    await deleteObject(imageRef(media.uid));
    throw e;
  }
}

export async function removeMedia(userId: string, media: Media): Promise<void> {
  await deleteObject(imageRef(media.uid));
  await updateDoc(userRef(userId), { medias: arrayRemove(media) });
}
