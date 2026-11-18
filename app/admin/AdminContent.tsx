'use client';

import DashboardShell, { GoTo, Logout, type DashboardPage } from '../../components/DashboardShell';
import ArticleManagementContainer from './ArticleManagement';
import UserManagementContainer from './UserManagement';

import { IoIosSettings } from 'react-icons/io';
import { MdOutlineDashboard } from 'react-icons/md';
import { GiBookshelf } from 'react-icons/gi';
import { RiArticleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { BsFiles } from 'react-icons/bs';
import { FaUsersCog } from 'react-icons/fa';

const PAGES: DashboardPage[] = [
  { label: 'Dashboard', icon: <MdOutlineDashboard/>, element: <p> Dashboard Working </p> },
  { label: 'Manage Courses', icon: <GiBookshelf/>, element: <p> COURSES Working </p> },
  { label: 'Manage Articles', icon: <RiArticleLine/>, element: <ArticleManagementContainer/> },
  { label: 'Manage Resources', icon: <BsFiles/>, element: <p> Resource Working </p> },
  { label: 'Manage Users', icon: <FaUsersCog/>, element: <UserManagementContainer/> },
  { label: 'Settings', icon: <IoIosSettings/>, element: <p> Working </p> },
  { label: 'User Dashboard', icon: <IoIosSettings/>, element: <GoTo href='/dashboard'/> },
  { label: 'Logout', icon: <RiLogoutCircleRLine/>, element: <Logout/> },
];

export default function AdminContent() {
  return <DashboardShell pages={PAGES} managersOnly/>;
}
