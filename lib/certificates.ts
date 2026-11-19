/*
 * Course completion certificates (the `certificates` Firestore collection).
 * Certificates are public (firestore.rules), so these work for any visitor,
 * on the server or in the browser. They are issued only by the server
 * (lib/server/enrollments.ts).
 */

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

import { firebaseStore } from './firebase';
import type { CertificateDoc, CertificateDTO } from '../types/courses';

const CERTIFICATES = 'certificates';

function toDTO(id: string, data: CertificateDoc): CertificateDTO {
  return { ...data, id, issuedAt: data.issuedAt.toMillis() };
}

export async function getCertificate(id: string): Promise<CertificateDTO | null> {
  if (!/^[A-Za-z0-9]{1,64}$/.test(id)) return null;
  const snapshot = await getDoc(doc(firebaseStore, CERTIFICATES, id));
  return snapshot.exists() ? toDTO(snapshot.id, snapshot.data() as CertificateDoc) : null;
}

export async function listCertificatesForUser(uid: string): Promise<CertificateDTO[]> {
  const snapshot = await getDocs(query(collection(firebaseStore, CERTIFICATES), where('uid', '==', uid)));
  return snapshot.docs
    .map((item) => toDTO(item.id, item.data() as CertificateDoc))
    .sort((a, b) => b.issuedAt - a.issuedAt);
}
