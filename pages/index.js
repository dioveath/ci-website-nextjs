import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar.js';
import Hero from '../components/home/Hero.js';
import Footer from '../components/footer/Footer.js';

import useAuth from '../lib/hooks/Auth.js';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content="Official Site of Charicha Institute" />
        <meta property="og:image" itemProp="image" content="landing_image.png"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>
        <Hero/>

      </main>

      <Footer/>
    </div>
  );
}
