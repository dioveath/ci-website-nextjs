'use client';

import { useContext } from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';

import { pageContext } from './index';
import { ChevronLeft } from 'lucide-react';
import type { Article } from '@/types';

export default function ViewArticleContainer({ article }: { article: Article }){
  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className='px-2 md:px-4'>
      <button className='flex items-center text-white mb-10' onClick={() => {
        setPage(0);
        setArticle(null);
      }}>
        <ChevronLeft className='size-6'/> Back
      </button>     
      <ArticleRenderer data={article.body}/>
    </div>
  );
}
