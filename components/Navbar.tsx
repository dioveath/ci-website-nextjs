'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "../styles/components/Navbar.module.css";
import Marginer from "../components/utils/Marginer";
import { useMediaQuery } from "react-responsive";
import { SCREENS } from "../lib/utils/Responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsPersonFill } from "react-icons/bs";
import { RxCross2 } from 'react-icons/rx';

import { DropdownMenu } from "../components/DropdownMenu/index";

import NavItem from "./Navbar/NavItem";
import useAuth from "../lib/hooks/Auth";
import { useNavigation } from "../lib/sanity/useNavigation";

import type { User } from 'firebase/auth';
import type { UserData } from '../types';
import type { DropdownItem } from './DropdownMenu';

export interface NavLink { href: string; label: string }

interface NavListProps {
  showMenu: boolean;
  isMobile: boolean;
  user: User | null;
  userData: UserData | null;
  setShowMenu: (v: boolean) => void;
  dropdownList?: DropdownItem[];
  path?: string;
  headerLinks?: NavLink[];
}

export default function Navbar({ path }: { path?: string }) {
  // next/navigation has no singleton Router export, so this is now a hook.
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: SCREENS.lg });
  const [showMenu, setShowMenu] = useState(false);
  const { user, userData, logout } = useAuth();
  const { headerLinks } = useNavigation();

  const dropdownList = [
    {
      name: "Profile",
      onClick: () => {
        router.push("/profile/" + user?.uid);
      },
    },
    {
      name: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
    {
      name: "Logout",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <nav
      className={
        `w-full flex justify-between py-4 px-8 md:px-10 xl:px-20 2xl:px-48 font-normal`
      }
    >
      <Link href="/">
        <Image
          src="/ci_logo_light_blue.png"
          alt="Charicha Institute Logo"
          width={140}
          height={50}
        />
      </Link>

      {!isDesktop && !showMenu && (
        <NavHamburger setShowMenu={setShowMenu} showMenu={showMenu} />
      )}

      <NavList
        showMenu={showMenu}
        isMobile={!isDesktop}
        user={user}
        userData={userData}
        setShowMenu={setShowMenu}
        dropdownList={dropdownList}
        path={path}
        headerLinks={headerLinks}
      />
    </nav>
  );
}

const NavList = ({
  showMenu,
  isMobile,
  user,
  userData,
  setShowMenu,
  dropdownList,
  path,
  headerLinks,
}: NavListProps) => {
  return (
  <ul
    className={`${styles.navlist} ${(showMenu ? styles.navActive : styles.navInActive)}`}
  >
    {isMobile && showMenu &&
     (<div className='w-full h-4 flex justify-end cursor-pointer'>
         <RxCross2
           className='text-2xl text-white hover:text-red'
           onClick={() => {
             setShowMenu(!showMenu);
           }}
      />         
       </div>)}

    {(headerLinks || []).map((link: NavLink) => (
      <NavItem key={link.href + link.label} path={path} to={link.href} label={link.label} />
    ))}

    <Marginer horizontal="20px" />

    {user === null ? (
      <div className={`flex gap-4`}>
        <Link
          href="/login"
          className={
            "px-8 py-2 h-10 w-32 flex justify-center items-center bg-brightaqua hover:bg-slategray text-white rounded-3xl transition-all drop-shadow-md"
          }
        >
          Login
        </Link>

        <Link
          href="/register"
          className={
            "px-8 py-2 h-10 w-32 flex justify-center items-center bg-slategray hover:bg-brightaqua text-white rounded-3xl transition-all drop-shadow-md"
          }
        >
          Register
        </Link>
      </div>
    ) : (
      <div>
        <DropdownMenu
          title={
            <div className='rounded-full overflow-clip'>
              {userData?.profile_URL && (
                <Image
                  alt={user.displayName ?? "Profile picture"}
                  src={userData.profile_URL}
                  className={styles.userProfilePhoto}
                  width={40}
                  height={40}
                  quality={100}
                />
              )}
              {!userData?.profile_URL && <BsPersonFill className='text-white text-2xl'/>}
            </div>
          }
          itemList={dropdownList}
        />
      </div>
    )}
  </ul>
);
};

const NavHamburger = ({ setShowMenu, showMenu }: { setShowMenu: (v: boolean) => void; showMenu: boolean }) => (
  <div
    style={{
      marginRight: "20px",
      cursor: "pointer",
    }}
    onClick={() => {
      console.log(showMenu);
      if (!showMenu) setShowMenu(true);
    }}
  >
    <GiHamburgerMenu className="text-[32px] text-white" />
  </div>
);
