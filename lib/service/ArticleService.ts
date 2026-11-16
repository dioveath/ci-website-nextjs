import { firebaseStore } from "../firebase";
import { doc, deleteDoc, getDoc, getDocs, updateDoc, addDoc, collection, query, where, setDoc, startAfter, orderBy, limit } from "firebase/firestore";
import type { Article } from '../../types';

const ARTICLE_COLLECTION = "articles";


const ArticleService = {
  
  /*
   * @param {string} uid
   * @returns {Promise<Article>}
   */
  getArticle: async (articleId?: string): Promise<Article | null> => {
    if(!articleId) return null;

    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);

    if(!docSnap.exists()) return null;
    return docSnap.data() as Article;
  },

  listUserArticles: async (userId?: string): Promise<Article[]> => {
    if(!userId) return [];

    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, where('writtenBy', "==", userId), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
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
  paginateUserArticles: async (
    userId?: string,
    count = 10,
    order: string = 'createdAt',
    lastVisible?: Article | null
  ): Promise<Article[]> => {
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
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
    });    

    return articles;
  },

  /*
   * @param {Article} articleData
   * @returns {Promise<string>}
   */
  addNewArticle: async (articleData: Partial<Article>): Promise<string> => {
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
  updateArticle: async (articleId: string, newArticleData: Partial<Article>): Promise<boolean> => {
    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    await updateDoc(docRef, newArticleData);
    return true;
  },

  /*
   * @param {string} uid
   * @returns {Promise<Boolean>}
   */  
  deleteArticle: async (articleId: string): Promise<boolean> => {
    const docRef = doc(firebaseStore, ARTICLE_COLLECTION, articleId);
    await deleteDoc(docRef);
    return true;
  },


  listArticles: async (): Promise<Article[]> => {
    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, orderBy('createdAt', 'desc'), limit(100));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
    });

    return articles;
  },

  listPublishedArticles: async (order: 'asc' | 'desc' = 'desc'): Promise<Article[]> => {
    const docsRef = collection(firebaseStore, ARTICLE_COLLECTION);
    const q = query(docsRef, where('state', "==", "published"), orderBy('createdAt', order), limit(100));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
    });

    return articles;    
  }

};

export { ArticleService };
