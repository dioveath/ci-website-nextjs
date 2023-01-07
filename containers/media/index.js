import { useState } from 'react';
import Image from 'next/image';

import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from '../../lib/queryclient';

import useAuth from '../../lib/hooks/Auth';
import { UserService } from '../../lib/service/UserService';
import LoadingScreen from '../../components/LoadingScreen';

export default function MediaContainer(){
  const { isLoggedIn, userData, loading } = useAuth();
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

  if(loading) return <LoadingScreen/>;
  if(!isLoggedIn){ return <p> Redirect here! </p>; }  

  return (
    <div>
      <p> Welcome to your Media Center. </p>
      <p> These are all your files. </p>
      { isLoading && <p> Loading... </p> }
      { isFetching && <p> Fetching... </p> }
      { medias && medias.map((m) => {
        return <div key={m.uid} className='text-xs text-white'>
                 <Image alt={m.name} src={m.downloadURL} width={300} height={300} objectFit={'cover'}/>
		 <div>
      		   <p> ID: { m.uid }</p>
      		   <p> Name: { m.name }</p>
      		   <p> Size: { m.size }</p>
      		   <p> Content Type: { m.contentType }</p>
      		   <p> DownloadURL: { m.downloadURL }</p>
      		   <button className='bg-red-300 py-4' onClick={() => {onDelete(m); }}> Delete </button>
                 </div>
               </div>;
      })}


      <p> Upload new file! </p>
      { file && <Image alt="upload file" src={URL.createObjectURL(file)} width={300} height={300} objectFit={'cover'}/>}
      <input name="" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
      <button onClick={onUpload} className='bg-eggblue w-full py-4 hover:bg-slategray'> Upload </button>

    </div>
  );
  
}
