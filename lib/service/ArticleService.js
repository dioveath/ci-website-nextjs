import { firebaseStore } from "../firebase.js";
import { doc, setDoc, getDoc, getDocs, updateDoc, addDoc, collection, query, where } from "firebase/firestore";

const ARTICLE_COLLECTION = "articles";


const ArticleService = {
  
  /*
   * @param {string} uid
   * @returns {Promise<Article>}
   */
  getArticle: async (articleId) => {
    if(!articleId) return null;

    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);

    if(!docSnap.exists()) return null;
    return docSnap.data();
  },

  listArticles: async (userId) => {
    if(!userId) return [];

    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, where('writtenBy', "==", userId));

    const querySnapshot = await getDocs(q);
    const articles = [];
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return articles;
  },

  /*
   * @param {string} uid
   * @param {Article} userData
   * @returns {Promise<Boolean>}
   */
  addNewArticle: async (articleData) => {
    const newArticleData = {
      title: articleData.title,
      writtenBy: articleData.writtenBy,
      body: articleData.body,
      createdAt: new Date(),
      heartsBy: {},
      imageURL: articleData.imageURL ?? "",
      likes: 0
    };

    await addDoc(collection(firebaseStore, ARTICLE_COLLECTION), newArticleData);
    return true;
  },

  /*
   * @param {string} uid
   * @param {Article} userData
   * @returns {Promise<Boolean>}
   */  
  updateArticle: async (articleId, newArticleData) => {
    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    await updateDoc(docRef,newArticleData);
    return true;
  }
  

};

export { ArticleService };
