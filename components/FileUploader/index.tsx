'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '../ui/button';

export default function FileUploader(
  { file, setFile }: { file: File | null; setFile: (f: File | null) => void }
){
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => hiddenInputRef.current?.click();

  return (
    <>
      {file && (
        <div className='w-full overflow-clip rounded-2xl border bg-muted'>
          <div className='flex w-full items-center justify-end border-b bg-card px-3 py-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setFile(null)}
              aria-label='Remove selected file'
            >
              <X />
            </Button>
          </div>
          <Image
            alt=''
            src={URL.createObjectURL(file)}
            width={300}
            height={300}
            className='mx-auto h-auto w-full object-contain'
          />
        </div>
      )}

      {!file && (
        <button
          type='button'
          onClick={handleClick}
          className='flex h-52 w-full items-center justify-center rounded-2xl border-2 border-dashed border-input bg-muted text-muted-foreground transition-colors hover:border-ring hover:text-foreground'
        >
          <Plus className='size-8' aria-hidden />
          <span className='sr-only'>Choose a file to upload</span>
        </button>
      )}
      <input className='hidden' ref={hiddenInputRef} name="fileInput" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}/>
    </>
  );
} 
