import Image from "next/image";
import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { ArticleService } from "../../lib/service/ArticleService";
import { pageContext } from "./index";

export default function ArticleContainer() {
  const { user } = useAuth();
  const {
    data: articles,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const articles = await ArticleService.listArticles(user?.uid);
      return articles;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId) => {
      return ArticleService.deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const { setPage, setArticle } = useContext(pageContext);


  return (
    <div className="">
      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}

      <div className='px-4'>
        <p className="uppercase font-light text-3xl text-white"> Articles </p>
        <p className='font-light text-white'> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> Article Management </p>
      </div>

      <div className="flex flex-col gap-2">
        {articles &&
          articles.map((article) => (
            <div
              key={article.id}
              className="w-full overflow-clip text-white font-light py-2 px-4 gap-3 rounded-md flex flex-col justify-between"
            >
              <div className="w-full flex flex-wrap gap-3">
                <div className="flex justify-center items-center h-full max-w-[400px] bg-yellow-200">
                  <Image
                    src={article.thumbnail.downloadURL}
                    alt={article.title + " thumbnail"}
                    width={400}
                    height={200}
                    objectFit={"cover"}
                  />
                </div>
                <div className={"flex-1"}>
                  <p className="text-lg font-medium"> {article.title} </p>
                  <p> {article.body.blocks[0].text.substring(0, 250)}...</p>
                </div>
              </div>
              <div className="flex justify-between gap-2 ">
                <button
                  className="w-full py-2 bg-pinegreen hover:bg-greenpea rounded-full transition-all"
                  onClick={() => {
                    setArticle(article);
                    setPage(2);
                  }}
                >
                  View
                </button>
                <button
                  className='w-full py-2 bg-pinegreen hover:bg-greenpea rounded-full transition-all'
                  onClick={() => {
                    setArticle(article);
                    setPage(1);
                  }}
                >
                  Edit
                </button>
                <button
                  className='w-full py-2 bg-pinegreen hover:bg-greenpea rounded-full transition-all'
                  onClick={() => {
                    deleteMutation.mutate(article.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        <button
          className="w-full bg-eggblue text-white flex justify-center items-center py-4 px-2 hover:bg-pinegreen rounded-full transition-all"
          onClick={() => {
            setPage(1);
          }}
        >
          Add Article
        </button>
      </div>
    </div>
  );
}
