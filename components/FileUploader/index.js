import Image from 'next/image';
import { useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { BsPlusLg } from 'react-icons/bs';

export default function FileUploader({ file, setFile }){
  const hiddenInputRef = useRef();

  const handleClick = (_e) => hiddenInputRef.current.click();

  return (
    <>
      { file &&
        <div className='w-full bg-timbergreen flex flex-col justify-center items-center rounded-3xl overflow-clip'>
	  <div className='w-full flex justify-end items-center bg-riverbed py-3 px-5'>
            <RxCross1 onClick={() => setFile(null)} className='text-white text-3xl hover:rotate-45 cursor-pointer transition-all'/>            
          </div>
          <Image alt="upload file" src={URL.createObjectURL(file)} width={300} height={300} objectFit={'contain'} className='border-2 '/>
        </div> }
      { !file && <button onClick={handleClick} className='w-full h-52 bg-timbergreen flex flex-col justify-center items-center rounded-3xl overflow-clip'>
		   <div className='w-[96%] h-full flex m-4 justify-center items-center border-2 border-dashed rounded-3xl'>
                     <BsPlusLg className='text-4xl text-white'/>
                   </div>
                 </button> }
      <input className='hidden' ref={hiddenInputRef} name="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])}/>
    </>
  );
} 
