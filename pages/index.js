import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar.js';
import Hero from '../components/home/Hero.js';
import Footer from '../components/footer/Footer.js';

import useAuth from '../lib/hooks/Auth.js';

export default function Home() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute </title>
        <meta name="description" content="Official Site of Charicha Institute" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>
        <Hero/>

        <button onClick={() => { loginWithGoogle(); }} > Sign In </button>
        { "Hello " + user?.displayName }
        <button onClick={() => { logout(); }} > Sign Out </button>        
      </main>

      <Footer/>
    </div>
  );
}
