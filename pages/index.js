import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar.js';
import Hero from '../components/home/Hero.js';
import Footer from '../components/footer/Footer.js';

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../lib/particle_config';

import ReactPlayer from 'react-player';
import Stories from '../components/home/Stories';
import AppStore from '../components/home/AppStore';

import useWindowSize from '../lib/hooks/useWindowSize';
import { useMediaQuery } from 'react-responsive';
import { SCREENS } from '../lib/utils/Responsive';

export default function Home() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);

  const { width } = useWindowSize();
  const isMobile = useMediaQuery({ maxWidth: SCREENS.md });
  const isXMobile = useMediaQuery({ maxWidth: SCREENS.sm });

  return (
    <>
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content="Official Site of Charicha Institute" />
        <meta property="og:image" itemProp="image" content="landing_image.jpg"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'bg-gradient-[-45deg] from-eggblue to-slategray'}>
        <Navbar path={'/'}/>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        
	<div className='lg:h-20'></div>
        <Hero/>

	<div className='flex justify-center'>
	  <div className='rounded-2xl overflow-clip shadow-lg w-full max-w-2xl h-60 sm:h-96 mx-6'>
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              className='w-full h-full'
              url='https:www.youtube.com/watch?v=lvWUO2YTe-M'/>
          </div>
        </div>
	<p className='mt-4 text-center text-[24px] text-white'> See us in Action </p>            
	<div className='h-40'></div>

        <Stories/>
        <AppStore/>

	<div className='h-20'></div>
      </main>


      <Footer/>

    </div>

    </>
  );
}
