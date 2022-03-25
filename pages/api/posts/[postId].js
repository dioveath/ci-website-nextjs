import { firebaseStore } from '../../../lib/firebase.js';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

// const usersRef = collection(firebaseStore, "ci_users");

export async function getPost(postId){
  if(postId === undefined) return undefined;
  const docRef = doc(firebaseStore, "articles", postId);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    return docSnap.data();
  } else {
    console.log("No such post!");
    return undefined;
  }
}

export default async function handler(req, res){
  const { postId } = req.query;
  const post = await getPost(postId);
  return res.status(post == undefined ? 400 : 200).json(post != null ? post : { "message": "No such post!"});
}
