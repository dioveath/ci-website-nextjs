'use client';

import Image from "next/image";
import { useContext, useState } from "react";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";

import useAuth from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import { pageContext } from "./index";
import { articleSummary } from "@/lib/editor/serialize";
import { Loader2, PenLine } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from '@/types';
import { deleteArticle, listArticlesByAuthor } from '@/lib/articles';

type ArticlePageParam = { lastDoc: Article } | undefined;

export default function ArticleContainer() {
  const { user, isLoggedIn } = useAuth();
  const [articlePage, setArticlePage] = useState(0);
  const { setPage, setArticle } = useContext(pageContext);

  const { data, isFetching, isRefetching, isLoading, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["articles"],
      queryFn: async ({ pageParam }) => {
        return listArticlesByAuthor(user?.uid, pageParam?.lastDoc);
      },
      enabled: isLoggedIn,
      refetchOnMount: true,
      initialPageParam: undefined as ArticlePageParam,
      getNextPageParam: (lastPage: Article[]): ArticlePageParam =>
        lastPage?.length ? { lastDoc: lastPage[lastPage.length - 1] } : undefined,
    });

  const deleteMutation = useMutation({
    mutationFn: (articleId: string) => {
      return deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const onClickNextPage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data) return;
    if (articlePage < data.pages.length - 1) {
      setArticlePage(articlePage + 1);
      return;
    }

    // v5 drops the pageParam option: the cursor comes from getNextPageParam.
    fetchNextPage().then(() => setArticlePage(data.pages.length));
  };

  const onClickPrevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data || articlePage <= 0) return;
    setArticlePage(articlePage - 1);
  };

  return (
    <div className="">
      {/* <div className="fixed z-10 w-full h-48 bg-slategray"> */}
        <div className="px-4">
          <p className="uppercase font-light text-3xl text-white"> Articles </p>
          <p className="font-light text-white"> {new Date().toDateString()} </p>
        </div>

        <div className="max-w-lg rounded-r-full bg-primary text-primary-foreground py-2 px-4 my-4">
          <p className="text-white text-xl font-light"> Write an Article </p>
        </div>

        <div className="py-2">
          <p className="font-light text-white"> Whats on your mind? </p>
        </div>
      {/* </div> */}
      {/* <div className="h-48 w-full"> </div> */}

      <button
        className="w-full bg-primary text-primary-foreground flex justify-center items-center gap-2 py-3 px-2 hover:bg-primary/90 rounded-full transition-all"
        onClick={() => {
          setPage(1);
        }}
      >
        <PenLine className="size-5" />
        Write an Article
      </button>

      <div className="max-w-lg rounded-r-full bg-primary text-primary-foreground py-2 px-4 my-4 mt-10 flex gap-4 items-end">
        <p className="text-white text-xl font-light"> Article Management </p>
        {(isFetching || isRefetching) && (
          <Loader2 className="size-5 animate-spin text-primary" aria-label="Loading" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading && <Skeleton className="h-50 w-full" />}

        {data && !isRefetching && data.pages[articlePage].length === 0 && (
          <p className="text-white"> No more articles... </p>
        )}
        {data &&
          !isRefetching &&
          data.pages[articlePage].map((article: Article) => (
            <div
              key={article.id}
              className="w-full overflow-clip bg-card text-card-foreground font-light p-4 gap-3 rounded-md flex flex-col justify-between"
            >
              <div className="w-full flex flex-wrap gap-3">
                <div className="flex justify-center items-center h-full max-w-100 bg-muted">
                  <Image
                    src={article.thumbnail?.downloadURL ?? "/upload.webp"}
                    alt={article.title + " thumbnail"}
                    width={320}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className={"flex-1 flex flex-col justify-between"}>
                  <div>
                    <p className="text-base lg:text-lg text-foreground font-medium">
                      {article.title}{" "}
                    </p>
                    <p> {articleSummary(article.body).substring(0, 250)}...</p>
                    <p className="text-xs text-destructive">
                      {article.heartsBy.length || "0"} Hearts{" "}
                    </p>
                    <p className="text-xs text-foreground">
                      {" "}
                      {new Date(
                        ((article.createdAt as { seconds?: number } | null)?.seconds ?? 0) * 1000
                      ).toDateString()}{" "}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2 ">
                    <button
                      disabled={isFetching}
                      className={`w-full py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-full transition-all ${
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
                      className={`w-full py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-full transition-all ${
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
                      className={`w-full py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-full transition-all ${
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
          className="bg-destructive text-destructive-foreground py-3 px-10 rounded-full disabled:bg-muted disabled:text-muted-foreground"
          disabled={articlePage === 0 ? true : false}
          onClick={onClickPrevPage}
        >
          Previous
        </button>

        <button
          className="bg-primary text-primary-foreground py-3 px-10 rounded-full disabled:bg-muted disabled:text-muted-foreground"
          disabled={data && data.pages[articlePage].length < 2 ? true : false}
          onClick={onClickNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
