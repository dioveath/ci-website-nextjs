'use client';

import Image from "next/image";
import { BsChevronDoubleDown } from 'react-icons/bs';
import { homePageFallback } from '../../lib/sanity/fallbacks';

export default function Hero({ hero = homePageFallback.hero }) {

  return (
    <div className='w-full max-h-max px-8 md:px-10 xl:px-20 2xl:px-48 mb-20'>
      <div className={'w-full flex flex-wrap-reverse gap-2 justify-center'}>
        <div className={'w-full lg:max-w-lg flex flex-col gap-4 justify-center'}>
	  <p className='text-white font-medium text-[38px] md:text-[52px] xl:text-[64px] leading-12 xl:leading-18'> {hero.title} </p>
	  <p className='text-white text-sm md:text-base xl:text-lg font-light'> {hero.subtitle} </p>
	  <button className="max-w-sm py-4 text-white text-[32px] bg-brightaqua rounded-full hover:bg-slategray drop-shadow-md duration-500"> {hero.ctaLabel} </button>
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
