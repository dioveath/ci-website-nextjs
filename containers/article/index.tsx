'use client';

import { createContext, useState } from 'react';
import ListArticlesContainer from './ListArticlesContainer';
import AddArticleContainer from './AddArticleContainer';
import ViewArticleContainer from './ViewArticleContainer';
import type { Article } from '../../types';

export interface ArticlePageContext {
  page: number;
  setPage: (page: number) => void;
  setArticle: (article: Article | null) => void;
}

// Typed as non-null: the three child containers only ever render inside the
// provider below, and an untyped context was making setPage/setArticle
// `unknown` at every call site.
const pageContext = createContext<ArticlePageContext>({
  page: 0,
  setPage: () => {},
  setArticle: () => {}
});


export default function ArticleContainer(){
  const [page, setPage] = useState(0);
  const [article, setArticle] = useState<Article | null>(null);

  return (
    <pageContext.Provider value={{
      page, setPage, setArticle
    }}>
      <div className='py-4'>
        { page === 0 && <ListArticlesContainer/> }
        { page === 1 && <AddArticleContainer article={article}/> }
        { page === 2 && article && <ViewArticleContainer article={article}/> }
      </div>

    </pageContext.Provider>
  );
}


export { pageContext };
