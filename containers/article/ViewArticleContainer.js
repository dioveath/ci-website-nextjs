import { useContext } from 'react';
import DraftRenderer from '../../components/DraftRenderer';

import { pageContext } from './index';


export default function ViewArticleContainer({article}){
  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div>
      <button onClick={() => {
        setPage(0);
        setArticle(null);
      }}> Back </button>      
      <DraftRenderer raw={article.body}/>
    </div>
  );
}
