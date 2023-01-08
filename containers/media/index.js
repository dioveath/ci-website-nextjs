import { useState } from 'react';
import Image from 'next/image';

import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from '../../lib/queryclient';

import useAuth from '../../lib/hooks/Auth';
import { UserService } from '../../lib/service/UserService';

import FileUploader from '../../components/FileUploader';

export default function MediaContainer(){
  const { isLoggedIn, userData } = useAuth();
  const [file, setFile] = useState(null);

  const clearForm = () => setFile(null);

  const { data: medias, isFetching, isLoading } = useQuery({
    queryKey: ['medias'],
    queryFn: async () => {
      const data = await UserService.getUser(userData.id);
      return data.userData.medias;
    },
    enabled: isLoggedIn,
  });

  const addMutation = useMutation({
    mutationFn: (newMedia) => {
      return UserService.addMedia(userData.id, newMedia);
    }, onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['medias']});
      clearForm();
    }
  });

  const removeMutation = useMutation({
    mutationFn: (uid) => {
      return UserService.removeMedia(userData.id, uid);
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({queryKey: ['medias']});
    }
  });

  const onUpload = (e) => {
    e.preventDefault();

    if(!file) {
      console.log('Hey select some file!');
      return;
    }
    addMutation.mutate(file);
  };

  const onDelete = (m) => {
    removeMutation.mutate(m);
  };

  return (
    <div className=''>
      { isLoading && <p> Loading... </p> }
      { isFetching && <p> Fetching... </p> }

      <div className='px-4'>
        <p className="uppercase font-light text-3xl text-white"> Resources </p>
        <p className='font-light text-white'> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> Media Center </p>
      </div>      

      <div className='w-full flex flex-wrap gap-2 justify-center lg:justify-start'>
      { medias && medias.map((m) => {
        return <div key={m.uid} className={`text-xs text-white font-light w-[250px] p-4 flex 
                    flex-col items-center rounded-2xl overflow-clip  shadow-lg
                    bg-timbergreen gap-2`}>
                 <Image alt={m.name} src={m.downloadURL} width={200} height={200} objectFit={'cover'}/>

		 <div className='w-full flex flex-col justify-start'>
      		   <p className='text-ellipsis'> Name: { m.name.substring(0, 24) + (m.name.length > 24 ? '...' : '')}</p>
      		   <p> Size: { m.size }</p>
      		   <p> Content Type: { m.contentType }</p>
                 </div>
      		 <a className='w-full' href={m.downloadURL}>
                   <button className='w-full py-2 bg-pinegreen hover:bg-greenpea rounded-full transition-all'> Download </button>
                 </a>
                   
      		 <button className='w-full py-2 bg-pinegreen hover:bg-greenpea rounded-full transition-all' onClick={() => {onDelete(m); }}> Delete </button>
               </div>;
      })}
      </div>


      <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4 my-4">
        <p className="text-white text-xl font-light"> Upload New File </p>
      </div>            


      <FileUploader setFile={setFile} file={file}/>
      <button onClick={onUpload}
              className={`text-white bg-eggblue hover:bg-greenpea disabled:bg-riverbed  
                          w-full py-4 mt-5 rounded-full shadow-md transition-all 
                          ${addMutation.isLoading ? 'animate-pulse' : ''}`}
              disabled={addMutation.isLoading || !file}> Upload </button>
    </div>
  );
  
}
