/*
 * User profiles (the `ci_users` Firestore collection) and the media each user
 * uploads to Storage. Media lives on the user document, so uploads and deletes
 * keep Storage and Firestore in step here rather than in callers.
 */

import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL, deleteObject } from 'firebase/storage';

import { firebaseStore, firebaseStorage } from "./firebase";
import type { Media, NewUserInput, UserContact, UserData, UserProfileUpdate } from '../types';

const USERS = "ci_users";
const DEFAULT_AVATAR_LINK =
  "https://firebasestorage.googleapis.com/v0/b/ciapp-34d14.appspot.com/o/profile%2FCI_Logo_Graphic_512.png?alt=media&token=b4394411-5726-4f77-b0b9-971228aa4521";

const userRef = (userId: string) => doc(firebaseStore, USERS, userId);
const imageRef = (uid: string) => ref(firebaseStorage, `images/${uid}`);

export async function getUser(userId: string): Promise<UserData | null> {
  const snap = await getDoc(userRef(userId));
  return snap.exists() ? (snap.data() as UserData) : null;
}

/*
 * Creates the public profile and the private contact document together.
 * Every privileged field starts at the value firestore.rules requires, and
 * contact details never go on the publicly readable profile. (Admins list
 * users through the listUsers server action in app/admin/actions.ts.)
 */
export async function createUser(input: NewUserInput): Promise<void> {
  const { id, firstName, lastName, photoURL, email, phoneNumber } = input;
  if (!id) throw new Error("id is required!");

  const profile: UserData = {
    id,
    first_name: firstName ?? "",
    last_name: lastName ?? "",
    profile_URL: photoURL ?? DEFAULT_AVATAR_LINK,
    cover_URL: "",
    exp_points: 0,
    hearts: 0,
    roles: {},
    profile_visits: 0,
    medias: [],
    joined_at: Date.now(),
    on_board: false
  };
  const contact: UserContact = {
    email: email ?? null,
    phone_number: phoneNumber ?? "",
    address: ""
  };

  const batch = writeBatch(firebaseStore);
  batch.set(userRef(id), profile);
  batch.set(doc(firebaseStore, USERS, id, "private", "contact"), contact);
  await batch.commit();
}

/** Only the fields in USER_EDITABLE_FIELDS; firestore.rules rejects the rest. */
export async function updateUser(userId: string, data: UserProfileUpdate): Promise<void> {
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
