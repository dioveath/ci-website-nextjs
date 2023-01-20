import Head from "next/head";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useAuth from "../../lib/hooks/Auth.js";

import queryClient from '../../lib/queryclient';
import { QueryClientProvider } from '@tanstack/react-query';

import { useMediaQuery } from 'react-responsive';
import { SCREENS } from '../../lib/utils/Responsive.js';
import styles from "../../styles/dashboard/index.module.css";
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingScreen from '../../components/LoadingScreen/index.js';
import SideMenu from '../../components/SideMenu/index.js';

import ArticleManagementContainer from '../../containers/admin_article';
import UserManagementContainer from '../../containers/admin_user';

import { IoIosSettings } from 'react-icons/io';
import { MdOutlineDashboard } from 'react-icons/md';
import { GiBookshelf } from 'react-icons/gi';
import { RiArticleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { BsFiles } from 'react-icons/bs';
import { FaUsersCog } from 'react-icons/fa';


const Logout = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <LoadingScreen/>;
};

const ToUser = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  return <LoadingScreen/>;
};

const PAGES = [
  {
    label: 'Dashboard',
    icon: <MdOutlineDashboard/>,
    element: <p> Dashboard Working </p>
  },
  {
    label: 'Manage Courses',
    icon: <GiBookshelf/>,
    element: <p> COURSES Working </p>
  },
  {
    label: 'Manage Articles',
    icon: <RiArticleLine/>,
    element: <ArticleManagementContainer/>
  },
  {
    label: 'Manage Resources',
    icon: <BsFiles/>,
    element: <p> Resource Working </p>
  },
  {
    label: 'Manage Users',
    icon: <FaUsersCog/>,
    element: <UserManagementContainer/>
  },
  {
    label: 'Settings',
    icon: <IoIosSettings/>,
    element: <p> Working </p>
  },
  {
    label: 'User Dashboard',
    icon: <IoIosSettings/>,
    element: <ToUser/>
  },    
  {
    label: 'Logout',
    icon: <RiLogoutCircleRLine/>,
    element: <Logout/>
  }  
];

export default function Dashboard() {
  const isDesktop = useMediaQuery({ minWidth: SCREENS.lg });
  const { userData, isLoggedIn, loading } = useAuth();
  const [page, setPage] = useState(0);
  const [sideOpen, setSideOpen] = useState(isDesktop);
  const [onServer, setOnServer] = useState(true);
  const router = useRouter();


  useEffect(() => {
    if(typeof window !== 'undefined')
      setOnServer(false);
  }, []);

  if(onServer || loading) return <LoadingScreen/>;
  if(!isLoggedIn) {
    router.push('/');
    return <LoadingScreen/>;    
  }

  if(!userData.roles?.manager) {
    router.push('/dashboard');
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
