import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router';

import PuffLoader from 'react-spinners/PuffLoader';
import styles from "../../styles/dashboard/index.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/footer/Footer.js";

import useAuth from "../../lib/hooks/Auth.js";

export default function Dashboard() {
  const { user, userData, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!user && !loading) {
      router.push('/');
    }

    console.log(user);
  }, [router, user])


  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="main">
        <nav className={styles.sidebar}> Left Bar </nav>
	<main> Dashboard Content </main>
        <aside> Extra </aside>
      </div>
      
      <Footer />
    </div>
  );
}
