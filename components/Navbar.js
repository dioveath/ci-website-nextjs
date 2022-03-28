import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from '../styles/components/Navbar.module.css';
import Marginer from '../components/utils/Marginer.js';
import { useMediaQuery } from 'react-responsive';
import { SCREENS } from '../lib/utils/Responsive.js';
import { MdOutlineCancel } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Navbar(){
  const isMobile = useMediaQuery({ maxWidth: SCREENS.md});
  const [showMenu, setShowMenu] = useState(false);

  let navListStyle = styles.navlist;
  // if(!showMenu && isMobile)
  // navListStyle = styles["navlist-hide"];

  return (
    <nav className={styles.nav}>
      <div>
        <Image src="/ci_logo_full.png" alt="Charicha Institute Logo" width={140} height={50} />        
      </div>

      {
        !isMobile || showMenu ?
          <ul className={navListStyle}>
            {
              isMobile ? <div style={{
                "display": "flex",
                "justify-content": "flex-end",
                "cursor": "pointer"
              }}> <MdOutlineCancel size={20} onClick={() => {
                setShowMenu(!showMenu);
              }}/> </div> : ""
            }

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

            <Marginer horizontal="20px"/>

            <Link className={styles.navitem} href="/login">
              <a className={styles.loginButton}> Login </a>
            </Link>

            <Link className={styles.navitem} href="/register">
              <a className={styles.registerButton}> Register </a>
            </Link>        

          </ul> :
        <div style={{
          "marginRight": "20px",
          "cursor": "pointer"
        }}
             onClick={() => {
               setShowMenu(!showMenu);
             }}
        > <GiHamburgerMenu size={30}/> </div>
      }

    </nav>
  );

}
