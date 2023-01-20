import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { ArticleService } from "../../lib/service/ArticleService";
import { pageContext } from "./index";
import { extractSummary } from "../../lib/utils/summaryHelper";
import { RiQuillPenFill } from "react-icons/ri";
import PulseLoader from "react-spinners/PulseLoader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ArticleContainer() {
  const { user, isLoggedIn } = useAuth();
  const [articlePage, setArticlePage] = useState(0);
  const { setPage, setArticle } = useContext(pageContext);

  const { data, isFetching, isRefetching, isLoading, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["articles"],
      queryFn: async ({ pageParam }) => {
        const articles = await ArticleService.paginateUserArticles(
          user?.uid,
          10,
          undefined,
          pageParam?.lastDoc
        );
        return articles;
      },
      enabled: isLoggedIn,
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

  const onClickNextPage = async (e) => {
    e.preventDefault();
    if (!data) return;
    if (articlePage < data.pages.length - 1) {
      setArticlePage(articlePage + 1);
      return;
    }

    const lastPage = data.pages[data.pages.length - 1];
    const param = {
      lastDoc: lastPage[lastPage.length - 1],
    };

    fetchNextPage({ pageParam: param }).then(() =>
      setArticlePage(data.pages.length)
    );
  };

  const onClickPrevPage = (e) => {
    e.preventDefault();
    if (!data && articlePage <= 0) return;
    setArticlePage(articlePage - 1);
  };

  return (
    <div className="">
      {/* <div className="fixed z-10 w-full h-48 bg-slategray"> */}
        <div className="px-4">
          <p className="uppercase font-light text-3xl text-white"> Articles </p>
          <p className="font-light text-white"> {new Date().toDateString()} </p>
        </div>

        <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
          <p className="text-white text-xl font-light"> Write an Article </p>
        </div>

        <div className="py-2">
          <p className="font-light text-white"> Whats on your mind? </p>
        </div>
      {/* </div> */}
      {/* <div className="h-48 w-full"> </div> */}

      <button
        className="w-full bg-eggblue text-white flex justify-center items-center gap-2 py-3 px-2 hover:bg-pinegreen rounded-full transition-all"
        onClick={() => {
          setPage(1);
        }}
      >
        <RiQuillPenFill className="text-white hover:animate-ping text-xl" />
        Write an Article
      </button>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4 mt-10 flex gap-4 items-end">
        <p className="text-white text-xl font-light"> Article Management </p>
        {(isFetching || isRefetching) && <PulseLoader color="white" />}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading && <Skeleton height={200} />}

        {data && !isRefetching && data.pages[articlePage].length === 0 && (
          <p className="text-white"> No more articles... </p>
        )}
        {data &&
          !isRefetching &&
          data.pages[articlePage].map((article) => (
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
                    <p className="text-base lg:text-lg text-cheeseyellow font-medium">
                      {article.title}{" "}
                    </p>
                    <p> {extractSummary(article.body).substring(0, 250)}...</p>
                    <p className="text-xs text-red-500">
                      {article.heartsBy.length || "0"} Hearts{" "}
                    </p>
                    <p className="text-xs text-cheeseyellow">
                      {" "}
                      {new Date(
                        article.createdAt.seconds * 1000
                      ).toDateString()}{" "}
                    </p>
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
      </div>

      <div className="w-full flex justify-end gap-2 mt-6">
        <button
          className="bg-red-400 text-white py-3 px-10 rounded-full disabled:bg-riverbed"
          disabled={articlePage === 0 ? true : false}
          onClick={onClickPrevPage}
        >
          Previous
        </button>

        <button
          className="bg-blue-400 text-white py-3 px-10 rounded-full disabled:bg-riverbed"
          disabled={data && data.pages[articlePage].length < 2 ? true : false}
          onClick={onClickNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
