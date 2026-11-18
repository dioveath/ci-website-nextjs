'use client';

import DashboardShell, { GoTo, Logout, type DashboardPage } from '../../components/DashboardShell';
import MediaContainer from './_media';
import ArticleContainer from './_articles';

import { IoIosSettings, IoIosConstruct } from 'react-icons/io';
import { TfiStatsUp } from 'react-icons/tfi';
import { GiBookshelf } from 'react-icons/gi';
import { RiArticleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { VscFileMedia } from 'react-icons/vsc';
import { MdAdminPanelSettings } from 'react-icons/md';

const UnderConstruction = ({ pageName }: { pageName: string }) => {
  return <div className='flex flex-col w-full justify-center items-center'>
	   <div className='h-20'></div>
           <IoIosConstruct className='text-white text-[100px] animate-pulse'/>
	   <h1 className='text-white text-4xl uppercase'> Under construction </h1>
	   <h2 className='text-gray-500 text-xl '> Please visit &apos;{ pageName }&apos; shortly! </h2>
         </div>;
};

const PAGES: DashboardPage[] = [
  { label: 'Performance', icon: <TfiStatsUp/>, element: <UnderConstruction pageName={'Performance'}/> },
  { label: 'Courses', icon: <GiBookshelf/>, element: <UnderConstruction pageName={'Courses'}/> },
  { label: 'Articles', icon: <RiArticleLine/>, element: <ArticleContainer/> },
  { label: 'Resources', icon: <VscFileMedia/>, element: <MediaContainer/> },
  { label: 'Settings', icon: <IoIosSettings/>, element: <UnderConstruction pageName={'Settings'}/> },
  { label: 'Logout', icon: <RiLogoutCircleRLine/>, element: <Logout/> },
  { label: 'Admin Dashboard', icon: <MdAdminPanelSettings/>, element: <GoTo href='/admin'/>, managerOnly: true },
];

export default function DashboardContent() {
  return <DashboardShell pages={PAGES}/>;
}
