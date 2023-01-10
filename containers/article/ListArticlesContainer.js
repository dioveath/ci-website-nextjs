import Image from "next/image";
import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { ArticleService } from "../../lib/service/ArticleService";
import { pageContext } from "./index";
import { extractSummary } from '../../lib/utils/summaryHelper';

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
    refetchOnMount: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId) => {
      return ArticleService.deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      console.log("deleted");
    },
  });

  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className="">
      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}

      <div className="px-4">
        <p className="uppercase font-light text-3xl text-white"> Articles </p>
        <p className="font-light text-white"> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> Article Management </p>
      </div>

      <div className="flex flex-col gap-2">
        {articles &&
          articles.map((article) => (
            <div
              key={article.id}
              className="w-full overflow-clip bg-timbergreen text-white font-light p-4 gap-3 rounded-md flex flex-col justify-between"
            >
              <div className="w-full flex flex-wrap gap-3">
                <div className="flex justify-center items-center h-full max-w-[400px] bg-riverbed">
                  <Image
                    src={article.thumbnail.downloadURL}
                    alt={article.title + " thumbnail"}
                    width={320}
                    height={200}
                    objectFit={"cover"}
                  />
                </div>
                <div className={"flex-1 flex flex-col justify-between"}>
		  <div>
                    <p className="text-base lg:text-lg text-cheeseyellow font-medium"> {article.title} </p>
                    <p> {extractSummary(article.body).substring(0, 250)}...</p>
		    <p className='text-xs text-red-500'> { article.heartsBy.length || '0' } Hearts </p>
		    <p className='text-xs text-cheeseyellow'> { new Date(article.createdAt.seconds * 1000).toDateString() } </p>
                  </div>
                  <div className="flex justify-between gap-2 ">
                    <button
                      disabled={isFetching}
                      className={`w-full py-2 bg-pinegreen hover:bg-greenpea disabled:bg-riverbed rounded-full transition-all ${
                        isFetching ? "animate-pulse" : ""
                      }`}
                      onClick={() => {
                        setArticle(article);
                        setPage(2);
                      }}
                    >
                      View
                    </button>
                    <button
                      disabled={isFetching}
                      className={`w-full py-2 bg-pinegreen hover:bg-greenpea disabled:bg-riverbed rounded-full transition-all ${
                        isFetching ? "animate-pulse" : ""
                      }`}
                      onClick={() => {
                        setArticle(article);
                        setPage(1);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      disabled={isFetching}
                      className={`w-full py-2 bg-pinegreen hover:bg-greenpea disabled:bg-riverbed rounded-full transition-all ${
                        isFetching ? "animate-pulse" : ""
                      }`}
                      onClick={() => {
                        deleteMutation.mutate(article.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
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
