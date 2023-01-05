import Head from "next/head";
import Image from "next/image";
import Link from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from "../../styles/dashboard/index.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/footer/Footer.js";
import Tabbar from '../../components/tabbar/Tabbar.js';
import LoadingScreen from '../../components/LoadingScreen/index.js';

import useAuth from "../../lib/hooks/Auth.js";

export default function Dashboard() {
  const { user, userData, fetching, error } = useAuth();
  const router = useRouter();
  

  useEffect(() => {
    if(!user) router.push('/');
  }, [router, user]);


  if(!user && !userData) return <LoadingScreen/>;

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      
      <main className='bg-gradient-[-45deg] from-eggblue to-slategray'>
        <Navbar />
        {user && userData && <PageContent userData={userData} />}
      </main>
      <Footer />

    </div>
  );
}


const PageContent = ({userData}) => {

  return (
    <div className='bg-red-300'>
      <p className='text-3xl'> Welcome to Dashboard, { userData?.first_name } </p>
    </div>
  );
};
