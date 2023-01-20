import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useAuth from "../../lib/hooks/Auth.js";

import queryClient from "../../lib/queryclient";
import { QueryClientProvider } from "@tanstack/react-query";

import { useMediaQuery } from "react-responsive";
import { SCREENS } from "../../lib/utils/Responsive.js";
import styles from "../../styles/dashboard/index.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingScreen from "../../components/LoadingScreen/index.js";
import SideMenu from "../../components/SideMenu/index.js";

import MediaContainer from "../../containers/media";
import ArticleContainer from "../../containers/article";

import { IoIosSettings, IoIosConstruct } from "react-icons/io";
import { TfiStatsUp } from "react-icons/tfi";
import { GiBookshelf } from "react-icons/gi";
import { RiArticleLine, RiLogoutCircleRLine } from "react-icons/ri";
import { VscFileMedia } from "react-icons/vsc";
import { MdAdminPanelSettings } from "react-icons/md";

const Logout = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <LoadingScreen />;
};

const ToAdmin = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return <LoadingScreen />;
};

const AdminDashboard = {
  label: "Admin Dashboard",
  icon: <MdAdminPanelSettings />,
  element: <ToAdmin />,
};

const UnderConstruction = ({ pageName }) => {
  return <div className='flex flex-col w-full justify-center items-center'>
	   <div className='h-20'></div>
           <IoIosConstruct className='text-white text-[100px] animate-pulse'/>
	   <h1 className='text-white text-4xl uppercase'> Under construction </h1>
	   <h2 className='text-gray-500 text-xl '> Please visit &apos;{ pageName }&apos; shortly! </h2>
         </div>;
};

export default function Dashboard() {
  const isDesktop = useMediaQuery({ minWidth: SCREENS.lg });
  const { userData, isLoggedIn, loading } = useAuth();
  const [page, setPage] = useState(0);
  const [sideOpen, setSideOpen] = useState(isDesktop);
  const [onServer, setOnServer] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") setOnServer(false);
  }, []);

  if (onServer || loading) return <LoadingScreen />;
  if (!isLoggedIn) {
    router.push("/");
    return <LoadingScreen />;
  }

  let PAGES = [
    {
      label: "Performance",
      icon: <TfiStatsUp />,
      element: <UnderConstruction pageName={'Performance'}/>
    },
    {
      label: "Courses",
      icon: <GiBookshelf />,
      element: <UnderConstruction pageName={'Courses'}/>
    },
    {
      label: "Articles",
      icon: <RiArticleLine />,
      element: <ArticleContainer />,
    },
    {
      label: "Resources",
      icon: <VscFileMedia />,
      element: <MediaContainer />,
    },
    {
      label: "Settings",
      icon: <IoIosSettings />,
      element: <UnderConstruction pageName={'Settings'}/>
    },
    {
      label: "Logout",
      icon: <RiLogoutCircleRLine />,
      element: <Logout />,
    },
  ];

  if(userData.roles?.manager) PAGES.push(AdminDashboard);

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <main className="bg-slategray">
          <div className="flex">
            <SideMenu
              pages={PAGES}
              currentPage={page}
              setPage={setPage}
              isOpen={sideOpen}
              setSideOpen={setSideOpen}
            />
            <div className="w-full h-screen overflow-y-scroll pb-96 px-0 md:px-4">
              {PAGES[page].element}
            </div>
          </div>
        </main>
      </QueryClientProvider>
    </div>
  );
}
