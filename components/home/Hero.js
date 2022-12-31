import Image from "next/image";


export default function Hero() {

  return (
    <div className={'w-full h-full flex gap-2 px-48'}>
      <div className={'max-w-lg flex flex-col gap-4'}>
	<p className='text-white font-medium text-[64px] leading-[4.5rem]'> Start your Tech Journey! </p>
	<p className='text-white text-lg font-light'> Welcome to Charicha Institute, a premier computer training institute offering expert-led courses for all levels. Our team of qualified instructors and state-of-the-art facilities are dedicated to helping you succeed in the tech industry. Explore our course catalog and sign up for a class today. </p>

	<button className="max-w-sm py-4 text-white text-[32px] bg-brightaqua rounded-full hover:bg-slategray drop-shadow-md duration-500"> Join Us </button>
      </div>
      <div className={'w-full h-full flex flex-col relative -top-10'}>
        <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'700'} height={'500'}/>
      </div>
    </div>
  );
}
