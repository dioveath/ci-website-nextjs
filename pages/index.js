import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar.js';
import Hero from '../components/home/Hero.js';
import Footer from '../components/footer/Footer.js';


import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../lib/particle_config';


export default function Home() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);

  return (
    <>
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content="Official Site of Charicha Institute" />
        <meta property="og:image" itemProp="image" content="landing_image.jpg"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'bg-gradient-[0deg] from-eggblue to-slategray'}>
        <Navbar path={'/'}/>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        
	<div className='h-20'></div>
        <Hero/>
        <Footer/>
      </main>

    </div>

    </>
  );
}
