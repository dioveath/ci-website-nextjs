import { firebaseStore } from '../../../lib/firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export default async function handler(req, res){
  switch(req.method){
  case 'GET':
    return getUsers(req, res);
    break;
  case 'POST':
    return addPost(req, res);
    break;
  case 'PUT':
    return updatePost(req, res);
    break;
  case 'DELETE':
    return deletePost(req, res);
    break;
  default:
    break;
  }
};

const usersRef = collection(firebaseStore, "ci_users");

export async function getUsersFirestore(){
  const querySnapshot = await getDocs(usersRef);
  let allUsers = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    allUsers.push(doc.data());
  });
  return JSON.parse(JSON.stringify(allUsers));
}

export async function getUsers(req, res){
  return res.status(200).json(await getUsersFirestore());
}
