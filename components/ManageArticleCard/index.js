import Image from 'next/image';

export default function ManageArticleCard ({ article }){
  return (
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
                      {" "}
                      {article.title}{" "}
                    </p>
                    <p> {extractSummary(article.body).substring(0, 250)}...</p>
                    <p className="text-xs text-red-500">
                      {" "}
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
  );
}
