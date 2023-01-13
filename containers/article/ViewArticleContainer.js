import { useContext } from 'react';
import EditorJSRenderer from '../../components/EditorJSRenderer';

import { pageContext } from './index';
import { IoIosArrowBack } from 'react-icons/io';

export default function ViewArticleContainer({article}){
  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className='px-2 md:px-4'>
      <button className='flex items-center text-white mb-10' onClick={() => {
        setPage(0);
        setArticle(null);
      }}>
        <IoIosArrowBack className='text-4xl'/> Back
      </button>     
      <EditorJSRenderer data={article.body}/>
    </div>
  );
}
