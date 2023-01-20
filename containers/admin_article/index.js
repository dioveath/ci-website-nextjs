import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import useAuth from "../../lib/hooks/Auth";
import { ArticleService } from "../../lib/service/ArticleService";
import queryClient from "../../lib/queryclient";
import EditorJSRenderer from "../../components/EditorJSRenderer";

import { IoIosArrowBack } from "react-icons/io";

export default function ArticleManagementContainer() {
  const { isLoggedIn } = useAuth();
  const [viewArticle, setViewArticle] = useState(null);
  
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin_articles"],
    queryFn: async () => {
      const data = await ArticleService.listArticles();
      console.log(data);
      return data;
    },
    enabled: isLoggedIn,
  });

  const updateMutation = useMutation({
    mutationFn: (updateArticle) => {
      return ArticleService.updateArticle(updateArticle.id, updateArticle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_articles"] });
    },
  });

  const Columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Action",
        accessor: "action",
      },
      {
        Header: "Status",
        accessor: "state",
      },
    ],
    []
  );

  return (
    <div className='text-white text-sm'>

      <div className="px-4">
        <p className="uppercase font-light text-3xl text-white"> Articles </p>
        <p className="font-light text-white"> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> Article Management </p>
      </div>

      <div className="py-2">
        <p className="font-light text-white"> Article health check? </p>
      </div>

      {isLoading && <p> Loading... </p>}
      {isFetching && <p> Fetching... </p>}

      <div className="flex flex-col gap-2">
        {viewArticle && (
          <div>
            <button
              className="flex items-center text-white mb-10"
              onClick={() => {
                setViewArticle(null);
              }}
            >
              <IoIosArrowBack className="text-4xl" /> Back
            </button>
            <EditorJSRenderer data={viewArticle.body} />
          </div>
        )}

        {!viewArticle && (
          <table className=''>
            <tr>
              {Columns.map((column) => (
                <th key={column.accessor} className='text-left border-2 px-4 py-2 bg-riverbed'> {column.Header} </th>
              ))}
            </tr>
            {data &&
              data.map((article) => (
                <tr key={article.id} className='bg-timbergreen'>
                  <td className='border-2 px-4'> {article.id} </td>
                  <td className="w-96 border-2 px-4"> {article.title} </td>
                  <td className='border-2 px-4'>
		    <p className={`px-2 py-1 bg-blue-500 rounded-full text-center ${article.state == 'pending' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {article.state.toUpperCase()}
                    </p>
                  </td>

                  <td className='flex h-full items-center py-2 border-2 px-4 gap-2'>
                    <button
                      className={`w-full py-1 px-2 text-xs bg-eggblue hover:bg-greenpea disabled:bg-riverbed rounded-full transition-all ${
                        isFetching ? "animate-pulse" : ""
                      }`}
                      onClick={() => {
                        updateMutation.mutate({
                          id: article.id,
                          state: article.state == 'pending' ? 'published' : 'pending'
                        });
                      }}
                    >
                      { article.state == 'pending' ? 'Publish' : 'Unpublish'}
                    </button>
                    <button
                      className={`w-full py-1 px-2 text-xs bg-pinegreen hover:bg-greenpea disabled:bg-riverbed rounded-full transition-all ${
                        isFetching ? "animate-pulse" : ""
                      }`}
                      onClick={() => {
                        setViewArticle(article);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </table>
        )}
      </div>
    </div>
  );
}
