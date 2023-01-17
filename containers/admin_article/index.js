import { useQuery, useMutation } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import { ArticleService } from '../../lib/service/ArticleService';
import queryClient from '../../lib/queryclient';

export default function ArticleManagementContainer(){
  const { isLoggedIn } = useAuth();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin_articles'],
    queryFn: async() => {
      const data = await ArticleService.listArticles();
      console.log(data);
      return data;
    },
    enabled: isLoggedIn
  });


  const updateMutation = useMutation({
    mutationFn: (updateArticle) => {
      return ArticleService.updateArticle(updateArticle.id, updateArticle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      console.log('update successful!');
    },
  });


  return (
    <div>
      <div> Article Management Container / Scene </div>
      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}

      <div className='flex flex-col gap-2'>
      {data && data.map((article) => (
        <div key={article.id}>
      	  <p> ID: { article.id } </p>
      	  <p> Name: { article.title } </p>

	  <button className='bg-blue-400'
                  onClick={() => {
                    updateMutation.mutate({
                      id: article.id,
                      state: 'pending'
                    });
                  }}>
            Update
          </button>

        </div>
      ))}
      </div>
    </div>
  );
}
