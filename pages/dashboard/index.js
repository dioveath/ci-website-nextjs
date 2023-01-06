import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from "../../styles/dashboard/index.module.css";
import LoadingScreen from '../../components/LoadingScreen/index.js';

import useAuth from "../../lib/hooks/Auth.js";

export default function Dashboard() {
  const { user, userData, fetching, error } = useAuth();
  const router = useRouter();
  

  useEffect(() => {
    if(fetching) return;
    if(!user) router.push('/');
  }, [router, user, fetching]);


  if(fetching) {
    return <LoadingScreen/>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className='bg-gradient-[-45deg] from-eggblue to-slategray'>
        {user && userData && <PageContent userData={userData} path={router.asPath}/>}
      </main>
      {/* <Footer /> */}

    </div>
  );
}


const PageContent = ({userData, path}) => {

  return (
    <div className='w-full'>
      <p className='text-3xl'> Welcome to Dashboard, { userData?.first_name } </p>
      <div>
        <Link href={`${path}/article`}> Add New Article </Link>
      </div>
    </div>
  );
};
