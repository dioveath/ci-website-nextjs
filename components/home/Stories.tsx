'use client';

import ReactPlayer from 'react-player';
import { homePageFallback } from '../../lib/sanity/fallbacks';

function StoryVideo({ url }: { url: string }) {
  return (
    <div className='rounded-2xl overflow-clip shadow-lg w-full max-w-2xl h-60 sm:h-96 mx-6'>
      <ReactPlayer width={'100%'} height={'100%'} className='w-full h-full' src={url}/>
    </div>
  );
}

function StoryText({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className='text-lg lg:text-2xl text-white uppercase mx-6'> {title} </p>
      <p className='max-w-md text-sm lg:text-base text-white font-light mx-6'>{body}</p>
    </div>
  );
}

export default function Stories({ stories = homePageFallback.stories }){
  return (
    <>
      {stories.map((story, index) => {
        const key = story.title + index;
        // Alternate layout: even rows show video-left, odd rows show video-right.
        const reversed = index % 2 === 1;
        return (
          <div
            key={key}
            className={
              (reversed
                ? 'flex flex-wrap-reverse'
                : 'flex flex-wrap') + ' justify-center gap-8 bg-slategray py-8'
            }
          >
            {reversed ? (
              <>
                <StoryText title={story.title} body={story.body}/>
                <StoryVideo url={story.videoUrl}/>
              </>
            ) : (
              <>
                <StoryVideo url={story.videoUrl}/>
                <StoryText title={story.title} body={story.body}/>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
