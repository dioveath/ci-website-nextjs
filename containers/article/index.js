import { createContext, useEffect, useState } from 'react';
import ListArticlesContainer from './ListArticlesContainer';
import AddArticleContainer from './AddArticleContainer';
import ViewArticleContainer from './ViewArticleContainer';

const pageContext = createContext();


export default function ArticleContainer(){
  const [page, setPage] = useState(0);
  const [article, setArticle] = useState(null);

  return (
    <pageContext.Provider value={{
      page, setPage, setArticle
    }}>
      <div className='py-4'>
        { page === 0 && <ListArticlesContainer/> }
        { page === 1 && <AddArticleContainer article={article}/> }
        { page === 2 && <ViewArticleContainer article={article}/>}
      </div>

    </pageContext.Provider>
  );
}


export { pageContext };
