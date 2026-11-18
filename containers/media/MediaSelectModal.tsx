'use client';

import { useState } from 'react';
import Image from 'next/image';

import useAuth from '@/lib/auth';
import LoadingScreen from '../../components/LoadingScreen';
import type { Media } from '../../types';
import useMedia from './useMedia';


export default function MediaSelectModal(
  { setSelect, onClose }: { setSelect: (m: Media) => void; onClose: () => void }
) {
  const { isLoggedIn, loading } = useAuth();
  const [newFile, setNewFile] = useState<File | null>(null);
  const [fileProgress, setFileProgress] = useState(0);
  const { medias, isFetching, isLoading, upload } = useMedia();

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
                   <Image alt={m.name ?? ""} src={m.downloadURL} width={200} height={200} className="object-cover"/>
                 </div>;
        })}
      </div>

      <div className='w-full flex flex-col p-4 gap-4 text-white font-light'>
        { newFile && <Image src={URL.createObjectURL(newFile)} alt="upload image" width={200} height={200} className="object-contain"/>}
	<input name="New File" type="file" accept='image/*' onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}/>
        
	<div className='w-full bg-riverbed rounded-full overflow-clip'>
          <div className={`relative h-4 bg-mint transition-all`} style={{width: `${fileProgress}%`}}></div>
        </div>
	<button className='bg-eggblue py-2 text-white font-light rounded-full' onClick={() => {
          if (!newFile) return;
          upload.mutate({ file: newFile, onProgress: setFileProgress }, {
            onSuccess: () => { setNewFile(null); setFileProgress(0); }
          });
        }}> Upload </button>
      </div>      

    </div>
  );
}
