import { useState, useRef, useContext } from "react";
import Image from 'next/image';
import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { pageContext } from './index';
import { ArticleService } from "../../lib/service/ArticleService";
import { StorageService } from '../../lib/service/StorageService';
import MediaSelectModal from '../media/MediaSelectModal';

import { IoIosArrowBack } from 'react-icons/io';

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function AddArticleContainer({ article }) {
  const state = article ? EditorState.createWithContent(convertFromRaw(article.body)) : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(state);
  const [title, setTitle] = useState(article?.title);
  const [fieldError, setFieldError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

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
      console.log('onsuccess');
    }
  });

  const mutation = isEdit ? updateMutation : addMutation; 

  const onAddClick = async (e) => {
    e.preventDefault();
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    if(!title) {
      setFieldError('Title shoud be set!');
      return;
    }

    if(rawContentState.blocks.length <= 0) {
      setFieldError('Please add some content!');
      return;
    }
    
    if(isEdit) {
      const articleData = {
        body: rawContentState,
        title: title,
        ...(thumbnail && {
          thumbnail: {
            id: thumbnail.uid,
            downloadURL: thumbnail.downloadURL            
          }
        })
      };

      console.log(articleData);

      updateMutation.mutate(articleData);
    } else {
      if(!thumbnail) {
        setFieldError('Enter beautiful thumbnail!');
        return;
      }

      const articleData = {
        body: rawContentState,
        title: title,
        writtenBy: user.uid,
        ...(thumbnail && {
          thumbnail: {
            id: thumbnail.uid,
            downloadURL: thumbnail.downloadURL
          }
        })
      };

      addMutation.mutate(articleData);
    }

  };

  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className="w-full">

      <div className='px-4'>
        <p className="uppercase font-light text-3xl text-white"> { isEdit ? 'Edit' : 'Add'} an article </p>
        <p className='font-light text-white'> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> { isEdit ? 'Edit' : 'Add'} an Article </p>
      </div>

      <button className='flex items-center text-white' onClick={() => {
        setPage(0);
        setArticle(null);
      }}>
        <IoIosArrowBack className='text-4xl'/> Back
      </button>

      <input
        onChange={(e) => {setTitle(e.target.value);}}
        value={title}
        name="title"
        type="text"
        placeholder="Article Title"
        className="w-full py-4 my-4 px-4 rounded-lg"
      />

      { modalOpen && <MediaSelectModal onClose={() => setModalOpen(false)} setSelect={(image) => setThumbnail(image)}/> }      
      <div className='flex flex-col items-center gap-2 my-4'>
        {<Image alt='thumb upload'
                src={(thumbnail ? thumbnail.downloadURL : isEdit ? article.thumbnail.downloadURL : "/upload.webp")}
                width={'100px'} height={'100px'} objectFit={'cover'}/>}

        {!modalOpen && <button className='w-full bg-pinegreen py-3 text-white font-light rounded-full' onClick={() => setModalOpen(true)}> Select Thumbnail </button>}
      </div>
      

      {mutation.isError && <p> { mutation.error.message }</p>}
      {mutation.isSuccess && <p> Successfully { isEdit ? "Edited" : "Added"} </p>}
      <Editor
        readOnly={mutation.isLoading}
        editorState={editorState}
        wrapperClassName=""
        editorClassName="text-white"
        toolbarClassName=""
        onEditorStateChange={onEditorStateChange}
      />
      <button
        className="w-full bg-eggblue text-white py-4 rounded-full shadow-lg"
        onClick={onAddClick}
        disabled={mutation.isLoading}
      >
        { isEdit ? "Edit" : "Add" } Article
      </button>
    </div>
  );
}
