import { createContext, useState } from 'react';
import ListArticlesContainer from './ListArticlesContainer';
import AddArticleContainer from './AddArticleContainer';

const pageContext = createContext();


export default function ArticleContainer(){
  const [page, setPage] = useState(0);
  const [article, setArticle] = useState(null);

  return (
    <pageContext.Provider value={{
      page, setPage, setArticle
    }}>
      <div className='py-4'>
        { page === 1 && <AddArticleContainer article={article}/> }
        { page === 0 && <ListArticlesContainer/> }
      </div>

    </pageContext.Provider>
  );
}


export { pageContext };
