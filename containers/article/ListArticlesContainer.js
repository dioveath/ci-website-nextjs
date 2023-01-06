import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import { ArticleService } from '../../lib/service/ArticleService';
import { pageContext } from './index';


export default function ArticleContainer(){
  const { user } = useAuth();
  const { data: articles, isFetching, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const articles =  await ArticleService.listArticles(user?.uid);
      console.log(articles);
      return articles;
    },
    enabled: !!user
  });

  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className=''>
      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}
      <div className='flex flex-col gap-2'>
      {articles && articles.map(article =>
        <div key={article.id} className='bg-slategray text-white py-2 px-4 rounded-md flex justify-between'>
	  <div>
	    <p className='text-xs'> { article.id }</p>
	    <p className='text-lg'> { article.title } </p>
	    <p> { article.body.blocks[0].text }</p>            
          </div>
	  <div className='flex gap-2 cursor-pointer'>
	    <button onClick={() => {
              setArticle(article);
              setPage(1);
            }}> Edit </button>
	    <button> Delete </button>
          </div>
        </div>)}
      <button
        className='w-full bg-eggblue text-white flex justify-center items-center py-4 px-2 hover:bg-slategray'
        onClick={() => {
          setPage(1);
      }}> Add Article </button>        
      </div>
    </div>
  );
}
