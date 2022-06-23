import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Router from "next/router";

import styles from "../styles/components/Navbar.module.css";
import Marginer from "../components/utils/Marginer.js";
import { useMediaQuery } from "react-responsive";
import { SCREENS } from "../lib/utils/Responsive.js";
import { MdOutlineCancel } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsPersonFill } from "react-icons/bs";

import { DropdownMenu } from "../components/DropdownMenu/index.js";

import useAuth from "../lib/hooks/Auth.js";

export default function Navbar() {
  const isMobile = useMediaQuery({ maxWidth: SCREENS.md });
  const [showMenu, setShowMenu] = useState(false);
  const { user, userData, logout } = useAuth();
  // let navListStyle = styles.navlist;

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
        console.log("");
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
    <nav className={styles.nav}>
      <Link href="/">
        <a>
          <Image
            src="/ci_logo_full.png"
            alt="Charicha Institute Logo"
            width={140}
            height={50}
          />{" "}
        </a>
      </Link>

      {isMobile && (
        <NavHamburger setShowMenu={setShowMenu} showMenu={showMenu} />
      )}

      {!isMobile ||
        ((
          <NavList
            showMenu={showMenu}
            isMobile={isMobile}
            user={user}
            setShowMenu={setShowMenu}
          />
        ))}
    </nav>
  );
}

const NavList = ({ showMenu, isMobile, user, setShowMenu }) => (
  <ul
    className={`${styles.navlist} ${
      showMenu ? styles.navActive : styles.navInActive
    }`}
  >
    {isMobile ? (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <MdOutlineCancel
          size={20}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />{" "}
      </div>
    ) : (
      ""
    )}

    <Link className={styles.navitem} href="/">
      <a className={styles.anchorTag}> Home </a>
    </Link>
    <Link className={styles.navitem} href="/courses">
      <a className={styles.anchorTag}> Courses </a>
    </Link>
    <Link className={styles.navitem} href="/services">
      <a className={styles.anchorTag}> Services </a>
    </Link>
    <Link className={styles.navitem} href="/blog">
      <a className={styles.anchorTag}> Blog </a>
    </Link>
    <Link className={styles.navitem} href="/contact">
      <a className={styles.anchorTag}> Contact </a>
    </Link>

    <Marginer horizontal="20px" />

    {user === null ? (
      <div>
        <Link className={styles.navitem} href="/login">
          <a className={styles.loginButton}> Login </a>
        </Link>

        <Link className={styles.navitem} href="/register">
          <a className={styles.registerButton}> Register </a>
        </Link>
      </div>
    ) : (
      <div>
        <DropdownMenu
          title={
            user.photoURL !== undefined ? (
              <img
                alt={user.displayName}
                src={userData.photoURL}
                className={styles.userProfilePhoto}
              />
            ) : (
              <BsPersonFill size={24} />
            )
          }
          itemList={dropdownList}
        />
      </div>
    )}
  </ul>
);

const NavHamburger = ({ setShowMenu, showMenu }) => (
  <div
    style={{
      marginRight: "20px",
      cursor: "pointer",
    }}
    onClick={() => {
      if(!showMenu)
        setShowMenu(true);
    }}
  >
    <GiHamburgerMenu size={30} />
  </div>
);
