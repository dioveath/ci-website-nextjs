import Image from "next/image";
import { BsChevronDoubleDown } from 'react-icons/bs';

export default function Hero() {

  return (
    <div className='w-full max-h-max px-8 md:px-10 xl:px-20 2xl:px-48 mb-20'>
      <div className={'w-full flex flex-wrap-reverse gap-2 justify-center'}>
        <div className={'w-full lg:max-w-lg flex flex-col gap-4 justify-center'}>
	  <p className='text-white font-medium text-[38px] md:text-[52px] xl:text-[64px] leading-[3rem] xl:leading-[4.5rem]'> Start your Tech Journey! </p>
	  <p className='text-white text-sm md:text-base xl:text-lg font-light'> Welcome to Charicha Institute, a premier computer training institute offering expert-led courses for all levels. Our team of qualified instructors and state-of-the-art facilities are dedicated to helping you succeed in the tech industry. Explore our course catalog and sign up for a class today. </p>
	  <button className="max-w-sm py-4 text-white text-[32px] bg-brightaqua rounded-full hover:bg-slategray drop-shadow-md duration-500"> Join Us </button>
        </div>
        <div className={'min-w-md md:w-[50%] h-full flex flex-col relative md:-top-10'}>
          <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'700'} height={'500'}/>
        </div>
      </div>

      <div className="w-full flex justify-center mt-10">
        <BsChevronDoubleDown className="text-white text-[50px] animate-bounce"/>
      </div>
    </div>    
  );
}
