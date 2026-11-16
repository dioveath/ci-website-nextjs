import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Official Website'
};

export const revalidate = 60;
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import Footer from '../components/footer/Footer';


import ReactPlayer from 'react-player';
import Stories from '../components/home/Stories';
import AppStore from '../components/home/AppStore';
import { getHomePage } from '../lib/sanity/fetchers';
import { homePageFallback } from '../lib/sanity/fallbacks';
import ParticlesBackground from '../components/ParticlesBackground';

export default async function HomePage() {
  const home = await getHomePage();

  return (
    <>
    <div className={styles.container}>

      <main className={'bg-linear-[-45deg] from-eggblue to-slategray'}>
        <Navbar path={'/'}/>
        <ParticlesBackground/>
	<div className='lg:h-20'></div>
        <Hero hero={home.hero}/>

	<div className='flex justify-center'>
	  <div className='rounded-2xl overflow-clip shadow-lg w-full max-w-2xl h-60 sm:h-96 mx-6'>
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              className='w-full h-full'
              src={home.featureVideoUrl}/>
          </div>
        </div>
	<p className='mt-4 text-center text-[24px] text-white'> See us in Action </p>
	<div className='h-40'></div>

        <Stories stories={home.stories}/>
        <AppStore appPromo={home.appPromo}/>

	<div className='h-20'></div>
      </main>


      <Footer/>

    </div>

    </>
  );
}
