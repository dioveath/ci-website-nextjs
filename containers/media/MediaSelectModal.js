import { useState } from 'react';
import Image from 'next/image';

import useAuth from '../../lib/hooks/Auth';
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from '../../lib/queryclient';

import { UserService } from '../../lib/service/UserService';
import LoadingScreen from '../../components/LoadingScreen';


export default function MediaSelectModal({ setSelect, onClose }) {
  const { isLoggedIn, userData, loading } = useAuth();
  const [newFile, setNewFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);

  const clearForm = () => { setNewFile(null); setFileProgress(0); };
  const handleProgress = (percent) => setFileProgress(percent);

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
      return UserService.addMedia(userData.id, newMedia, handleProgress);
    }, onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['medias']});
      clearForm();
    }
  });

  if(loading) return <LoadingScreen/>;
  if(!isLoggedIn){ return <p> Redirect here! </p>; }    

  return (
    <div className={'bg-timbergreen'}>
      <div className='p-4 flex justify-between items-center'>
        <p className='text-white font-light'> Please select one of the media </p>
        <button className='bg-red-400 text-white px-4 py-2 rounded-2xl' onClick={onClose}> Close </button>        
      </div>
      <div className='flex flex-wrap gap-4 p-4'>
        { isLoading && <p> Loading... </p> }
        { isFetching && <p> Fetching... </p> }
        { medias && medias.map((m) => {
          return <div key={m.uid}
                      className='text-xs text-white border-2 border-transparent hover:border-cheeseyellow transition-all'
                      onClick={() => {
                        setSelect && setSelect(m);
                        onClose();
                      }}>
                   <Image alt={m.name} src={m.downloadURL} width={200} height={200} objectFit={'cover'}/>
                 </div>;
        })}
      </div>

      <div className='w-full flex flex-col p-4 gap-4 text-white font-light'>
        { newFile && <Image src={URL.createObjectURL(newFile)} alt="upload image" width={200} height={200} objectFit={'contain'}/>}
	<input name="New File" type="file" accept='image/*' onChange={(e) => setNewFile(e.target.files[0])}/>
        
	<div className='w-full bg-riverbed rounded-full overflow-clip'>
          <div className={`relative h-4 bg-mint transition-all`} style={{width: `${fileProgress}%`}}></div>
        </div>
	<button className='bg-eggblue py-2 text-white font-light rounded-full' onClick={() => {
          if(!newFile) {
            console.log('Select a file!');
            return;            
          }
          addMutation.mutate(newFile);
        }}> Upload </button>
      </div>      

    </div>
  );
}
