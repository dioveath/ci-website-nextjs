import ReactPlayer from 'react-player';

export default function Stories(){
  return (
    <>
	<div className='flex flex-wrap justify-center gap-8 bg-slategray py-8'>
	  <div className='rounded-2xl overflow-clip shadow-lg w-full max-w-2xl h-60 sm:h-96 mx-6'>
            <ReactPlayer
              width={'100%'} height={'100%'}
              className='w-full h-full' url='https://www.youtube.com/watch?v=ymth0TSHuvU&t=1s'/>
          </div>
	  <div>
	    <p className='text-lg lg:text-2xl text-white uppercase mx-6'> How it all started? </p>
	    <p className='max-w-md text-sm lg:text-base text-white font-light mx-6'>
            Initially, Charicha Institute was established in a garage with bunch of friends taking over computer parts. Charicha Institute has now paved its path through hardships & efforts to a great Company. Now, Charicha Institute is turning over thousands in a year. This is our success story.            
            </p>
          </div>
        </div>

	<div className='flex flex-wrap-reverse justify-center gap-8 bg-slategray py-8'>
	  <div>
	    <p className='text-lg lg:text-2xl text-white uppercase mx-6'> Moments in Charicha Institute </p>
	    <p className='max-w-md text-sm lg:text-base text-white font-light mx-6'>
              You many also get great experiences, including celebrating festivals and spending enjoyable evenings together. Our company&apos;s success is a result of the hard work, dedication, and perseverance of everyone involved. We continue to work towards continued success and growth in the future.
              We thank Madan Gurung for this great evening.
            </p>
          </div>          
	  <div className='rounded-2xl overflow-clip shadow-lg w-full max-w-2xl h-60 sm:h-96 mx-6'>
            <ReactPlayer
              width={'100%'} height={'100%'}              
              className='w-full h-full' url='https://www.youtube.com/watch?v=32mWaj4o6Z4'/>
          </div>
    </div>
    </>
  );
}
