import { useState, useRef, useContext } from "react";
import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { pageContext } from './index';
import { ArticleService } from "../../lib/service/ArticleService";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function AddArticleContainer({ article }) {
  const state = article ? EditorState.createWithContent(convertFromRaw(article.body)) : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(state);

  const [title, setTitle] = useState(article?.title);

  const { user } = useAuth();
  const isEdit = !!article;


  const onEditorStateChange = (editState) => {
    setEditorState(editState);
  };


  const addMutation = useMutation({
    mutationFn: (newArticle) => {
      return ArticleService.addNewArticle(newArticle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updateArticle) => {
      return ArticleService.updateArticle(article.id, updateArticle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"]});
    }
  });

  const mutation = isEdit ? updateMutation : addMutation; 

  const onAddClick = (e) => {
    e.preventDefault();
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    if(isEdit) {
      const articleData = {
        id: article.id,
        body: rawContentState,
        title: title
      };
      updateMutation.mutate(articleData);
    } else {
      const articleData = {
        body: rawContentState,
        title: title,
        writtenBy: user.uid,
      };

      addMutation.mutate(articleData);      
    }

  };

  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className="w-full px-8 md:px-10 xl:px-20 2xl:px-48">
      <button onClick={() => {
        setPage(0);
        setArticle(null);
      }}> Back </button>
      <input
        onChange={(e) => {setTitle(e.target.value);}}
        value={title}
        name="title"
        type="text"
        placeholder="Article Title"
        className="w-full py-4 mb-4 rounded-lg"
      />
      {mutation.isError && <p> { mutation.error.message }</p>}
      {mutation.isSuccess && <p> Successfully { isEdit ? "Edited" : "Added"} </p>}
      <Editor
        readOnly={mutation.isLoading}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
      <button
        className="w-full bg-eggblue text-white py-4 rounded-lg shadow-lg"
        onClick={onAddClick}
        disabled={mutation.isLoading}
      >
        { isEdit ? "Edit" : "Add" } Article
      </button>
    </div>
  );
}
