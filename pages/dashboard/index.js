import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from "../../lib/hooks/Auth.js";

import queryClient from '../../lib/queryclient';
import { QueryClientProvider } from '@tanstack/react-query';

import { useMediaQuery } from 'react-responsive';
import { SCREENS } from '../../lib/utils/Responsive.js';
import styles from "../../styles/dashboard/index.module.css";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingScreen from '../../components/LoadingScreen/index.js';
import SideMenu from '../../components/SideMenu/index.js';

import MediaContainer from '../../containers/media';
import ArticleContainer from '../../containers/article';

import {  IoIosSettings } from 'react-icons/io';
import { TfiStatsUp } from 'react-icons/tfi';
import { GiBookshelf } from 'react-icons/gi';
import { RiArticleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { VscFileMedia } from 'react-icons/vsc';


const PAGES = [
  {
    label: 'Performance',
    icon: <TfiStatsUp/>,
    element: <p> PERFORMANCE Working </p>
  },
  {
    label: 'Courses',
    icon: <GiBookshelf/>,
    element: <p> COURSES Working </p>
  },
  {
    label: 'Articles',
    icon: <RiArticleLine/>,
    element: <ArticleContainer/>
  },
  {
    label: 'Resources',
    icon: <VscFileMedia/>,
    element: <MediaContainer/>
  },
  {
    label: 'Settings',
    icon: <IoIosSettings/>,
    element: <p> Working </p>
  },
  {
    label: 'Logout',
    icon: <RiLogoutCircleRLine/>,
    element: <p> Logout </p>
  }
];


export default function Dashboard() {
  const isDesktop = useMediaQuery({ minWidth: SCREENS.lg });
  const { userData, isLoggedIn, loading, fetching, error } = useAuth();
  const [page, setPage] = useState(0);
  const [sideOpen, setSideOpen] = useState(isDesktop);
  const router = useRouter();

  if(loading) return <LoadingScreen/>;
  if(!isLoggedIn) {
    router.push('/');
    return <LoadingScreen/>;    
  }

  window.scrollTo(0, 0);

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
      <main className='bg-slategray'>
	<div className="flex">
          <SideMenu pages={PAGES}
                    currentPage={page}
                    setPage={setPage}
                    isOpen={sideOpen}
                    setSideOpen={setSideOpen}/>
	  <div className='w-full h-screen overflow-y-scroll pb-96 px-0 md:px-4'>
            { PAGES[page].element }
          </div>
        </div>
      </main>
      </QueryClientProvider>      

    </div>
  );
};
