import { useState, useRef, useContext, useCallback } from "react";
import Image from 'next/image';
import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EDITOR_JS_TOOLS } from '../../lib/editorjs/tools.js';

import useAuth from "../../lib/hooks/Auth";
import queryClient from "../../lib/queryclient";
import { pageContext } from './index';
import { ArticleService } from "../../lib/service/ArticleService";
import MediaSelectModal from '../media/MediaSelectModal';
import { IoIosArrowBack } from 'react-icons/io';

let ReactEditorJS = dynamic(() => import('../../components/ReactEditorJS'));


export default function AddArticleContainer({ article }) {
  const [title, setTitle] = useState(article?.title);
  const [fieldError, setFieldError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const { user } = useAuth();
  const isEdit = !!article;

  const editorCoreRef = useRef(null);


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

  const onAddClick = async (e) => {
    e.preventDefault();
    const rawContentState = await new Promise((resolve, reject) => {
      editorCoreRef.current.save().then((output) => {
        resolve(output);
      }).catch((error) => { reject(error); });
    });

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
        body: JSON.stringify(rawContentState),
        title: title,
        ...(thumbnail && {
          thumbnail: {
            id: thumbnail.uid,
            downloadURL: thumbnail.downloadURL            
          }
        })
      };


      updateMutation.mutate(articleData);
    } else {
      if(!thumbnail) {
        setFieldError('Enter beautiful thumbnail!');
        return;
      }

      const articleData = {
        body: JSON.stringify(rawContentState),
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
        className="w-full py-3 mt-4 px-4 rounded-lg outline-none focus:shadow-outline shadow"
      />

      { modalOpen && <MediaSelectModal onClose={() => setModalOpen(false)} setSelect={(image) => setThumbnail(image)}/> }      
      <div className='flex flex-col items-center gap-2 my-4'>
        {<Image alt='thumb upload'
                src={(thumbnail ? thumbnail.downloadURL : isEdit ? article.thumbnail.downloadURL : "/upload.webp")}
                width={'320px'} height={'200px'} objectFit={'cover'}/>}

        {!modalOpen && <button className='w-full bg-pinegreen py-3 text-white font-light rounded-full' onClick={() => setModalOpen(true)}> Select Thumbnail </button>}
      </div>
      
      



      <div className='w-full h-full rounded-xl flex justify-center items-center'>
	<div className='w-full h-full overflow-scroll-y bg-timbergreen p-4 rounded-xl prose dark:prose-invert'>
          {
            ReactEditorJS && <ReactEditorJS className='prose'
                                            innerRef={editorCoreRef}
                                            data={isEdit ? JSON.parse(article.body) : null}/>
          }
        </div>
      </div>

      <div className='py-4 px-4'>
        {mutation.isError && <p className='text-red-500 text-xs italic'> { mutation.error.message }</p>}
        {mutation.isSuccess && <p className='text-eggblue text-xs italic'> Successfully { isEdit ? "Edited" : "Added"} </p>}
        {fieldError && <p className='text-red-500 text-xs italic'> { fieldError }</p>}
      </div>

      <button
        className={`text-white bg-eggblue hover:bg-greenpea disabled:bg-riverbed  
                          w-full py-4 mt-5 rounded-full shadow-md transition-all 
                          ${mutation.isLoading ? 'animate-pulse' : ''}`}
        onClick={onAddClick}
        disabled={mutation.isLoading}
      >
        { isEdit ? "Edit" : "Add" } Article
      </button>
    </div>
  );
}
