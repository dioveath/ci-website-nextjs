import { firebaseStore } from '../../../lib/firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export default async function handler(req, res){
  switch(req.method){
  case 'GET':
    return getPosts(req, res);
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

const postsRef = collection(firebaseStore, "articles");

async function getPosts(req, res){
  const querySnapshot = await getDocs(postsRef);
  let allArticles = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    allArticles.push(doc.data());
  });
  return res.status(200).json(allArticles);
}
