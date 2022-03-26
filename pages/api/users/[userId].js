import { firebaseStore } from '../../../lib/firebase.js';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

export async function getUser(userId){
  const docRef = doc(firebaseStore, "ci_users", userId);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    return docSnap.data();
  } else {
    console.log("No such user!");
    return undefined;
  }
}

export default async function handler(req, res){
  const { userId } = req.query;
  const user = await getUser(userId);
  return res.status(user == undefined ? 400 : 200).json(user != null ? user : { "message": "No such user!"});
}
