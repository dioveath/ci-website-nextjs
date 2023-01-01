import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Router from "next/router";

import styles from "../styles/components/Navbar.module.css";
import Marginer from "../components/utils/Marginer.js";
import { useMediaQuery } from "react-responsive";
import { SCREENS } from "../lib/utils/Responsive.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsPersonFill } from "react-icons/bs";
import { RxCross2 } from 'react-icons/rx';

import { DropdownMenu } from "../components/DropdownMenu/index.js";

import NavItem from "./Navbar/NavItem";
import useAuth from "../lib/hooks/Auth.js";

export default function Navbar({ path }) {
  const isDesktop = useMediaQuery({ minWidth: SCREENS.lg });
  const [showMenu, setShowMenu] = useState(false);
  const { user, userData, logout } = useAuth();

  console.log(isDesktop);

  const dropdownList = [
    {
      name: "Profile",
      onClick: () => {
        Router.push("/profile/" + user?.uid);
      },
    },
    {
      name: "Dashboard",
      onClick: () => {
        Router.push("/dashboard");
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
        <a>
          <Image
            src="/ci_logo_light_blue.png"
            alt="Charicha Institute Logo"
            width={140}
            height={50}
          />
        </a>
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
}) => {
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

    <NavItem path={path} to={"/"} label={"Home"} />
    <NavItem path={path} to={"/courses"} label={"Courses"} />
    <NavItem path={path} to={"/services"} label={"Services"} />
    <NavItem path={path} to={"/blog"} label={"Blog"} />
    <NavItem path={path} to={"/contact"} label={"Contact"} />

    <Marginer horizontal="20px" />

    {user === null ? (
      <div className={`flex gap-4`}>
        <Link className="" href="/login">
          <a
            className={
              "px-8 py-2 h-10 w-32 flex justify-center items-center bg-brightaqua hover:bg-slategray text-white rounded-3xl transition-all drop-shadow-md"
            }
          >
            Login
          </a>
        </Link>

        <Link className={styles.navitem} href="/register">
          <a
            className={
              "px-8 py-2 h-10 w-32 flex justify-center items-center bg-slategray hover:bg-brightaqua text-white rounded-3xl transition-all drop-shadow-md"
            }
          >
            {" "}
            Register{" "}
          </a>
        </Link>
      </div>
    ) : (
      <div>
        <DropdownMenu
          title={
            <>
              {(user?.photoURL || userData?.photoURL) && (
                <img
                  alt={user.displayName}
                  src={userData?.photoURL}
                  className={styles.userProfilePhoto}
                />
              )}
              {user?.photoURL === undefined && <BsPersonFill size={24} />}
            </>
          }
          itemList={dropdownList}
        />
      </div>
    )}
  </ul>
);
}

const NavHamburger = ({ setShowMenu, showMenu }) => (
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
