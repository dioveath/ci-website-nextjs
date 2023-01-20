import { firebaseStore } from "../firebase.js";
import { doc, deleteDoc, getDoc, getDocs, updateDoc, addDoc, collection, query, where, push, setDoc, startAfter, orderBy, limit } from "firebase/firestore";

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

  listUserArticles: async (userId) => {
    if(!userId) return [];

    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, where('writtenBy', "==", userId), orderBy('createdAt', 'desc'));

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
   * @param {number} limit
   * @param {Article} lastVisible
   * @param {string} orderBy
   * @returns {Promise<Article[]>}
   */  
  paginateUserArticles: async (userId, count = 10, order='createdAt', lastVisible) => {
    if(!userId) return [];

    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    let q;

    if(lastVisible) {
      q = query(docsRef,
                where('writtenBy', '==', userId),
                orderBy(order, 'desc'),
                limit(count),
                startAfter(lastVisible.createdAt));
    } else {
      q = query(docsRef,
                where('writtenBy', '==', userId),
                orderBy(order, "desc"),
                limit(count));      
    }
    
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
   * @param {Article} articleData
   * @returns {Promise<string>}
   */
  addNewArticle: async (articleData) => {
    const colRef = doc(collection(firebaseStore, ARTICLE_COLLECTION));
    
    const newArticleData = {
      id: colRef.id,
      title: articleData.title,
      writtenBy: articleData.writtenBy,
      body: articleData.body,
      createdAt: new Date(),
      heartsBy: {},
      thumbnail: articleData.thumbnail,
      likes: 0,
      state: 'pending'
    };

    await setDoc(colRef, newArticleData);
    return colRef.id;
  },

  /*
   * @param {string} uid
   * @param {Article} userData
   * @returns {Promise<Boolean>}
   */  
  updateArticle: async (articleId, newArticleData) => {
    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    await updateDoc(docRef, newArticleData);
    return true;
  },

  /*
   * @param {string} uid
   * @returns {Promise<Boolean>}
   */  
  deleteArticle: async (articleId) => {
    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    await deleteDoc(docRef);
    return true;
  },


  listArticles: async () => {
    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, orderBy('createdAt', 'desc'), limit(100));

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

  listPublishedArticles: async (order='desc') => {
    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, where('state', "==", "published"), orderBy('createdAt', order), limit(100));

    const querySnapshot = await getDocs(q);
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return articles;    
  }

};

export { ArticleService };
