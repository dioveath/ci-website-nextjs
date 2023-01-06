import { createContext, useState, useContext, useEffect } from "react";
import { firebaseApp } from "../firebase.js";
import { getAuth } from "firebase/auth";


const auth = getAuth(firebaseApp);
const articlesContext = createContext();

export default function useArticle(){
  return useContext(articlesContext);
}


export function ArticleProvider(props){
  // const [articles, setArticles] = useState([]);
  // const [fetching, setFetching] = useState(false);
  // const [error, setError] = useState(null);

}
