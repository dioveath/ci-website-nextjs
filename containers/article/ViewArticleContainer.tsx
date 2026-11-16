'use client';

import { useContext } from 'react';
import ArticleRenderer from '../../components/ArticleRenderer';

import { pageContext } from './index';
import { IoIosArrowBack } from 'react-icons/io';
import type { Article } from '../../types';

export default function ViewArticleContainer({ article }: { article: Article }){
  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className='px-2 md:px-4'>
      <button className='flex items-center text-white mb-10' onClick={() => {
        setPage(0);
        setArticle(null);
      }}>
        <IoIosArrowBack className='text-4xl'/> Back
      </button>     
      <ArticleRenderer data={article.body}/>
    </div>
  );
}
