import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Router from 'next/router';

import styles from '../styles/components/Navbar.module.css';
import Marginer from '../components/utils/Marginer.js';
import { useMediaQuery } from 'react-responsive';
import { SCREENS } from '../lib/utils/Responsive.js';
import { MdOutlineCancel } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BsPersonFill } from 'react-icons/bs';

import { DropdownMenu } from '../components/DropdownMenu/index.js';

import useAuth from '../lib/hooks/Auth.js';

export default function Navbar(){
  const isMobile = useMediaQuery({ maxWidth: SCREENS.md});
  const [showMenu, setShowMenu] = useState(false);
  // const [height, setHeight] = useState(0);
  // const ref = useRef(null);
  const { user, logout } = useAuth();
  let navListStyle = styles.navlist;

  const dropdownList = [
    {
      name: "Profile",
      onClick: () => {
        Router.push("/profile/Pr2iG0ld5IOvjg5NQEAlHtf35ei1");
      }
    },
    {
      name: "Dashboard",
      onClick: () => { console.log(""); }
    },
    {
      name: "Logout",
      onClick: () => { logout(); }
    }
  ];

  // const fixedStyle = {
  //   "position": "fixed",
  //   "top": 0,
  //   "left": 0
  // };

  // const putFixed = () => {
  //   if(window.pageYOffset >= height){
  //   }
  // };

  // useEffect(() => {
  //   setHeight(ref.current.clientHeight);
  // });



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
                "justifyContent": "flex-end",
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

            {
              user === null ?
                <>
                  <Link className={styles.navitem} href="/login">
                    <a className={styles.loginButton}> Login </a>
                  </Link>

                  <Link className={styles.navitem} href="/register">
                    <a className={styles.registerButton}> Register </a>
                  </Link>
                </>
              : <>
                  {/*     <p style={{ */}
                  {/*   "fontSize": "14px", */}
                  {/*   "display": "flex", */}
                  {/*   "align-items": "center", */}
                  {/* }}>Hi, { user.displayName } </p><BsPersonFill size={24}/> */}

                  <DropdownMenu title={
                    user.photoURL !== undefined ?
                      <img alt={user.displayName} src={user.photoURL} className={styles.userProfilePhoto}/>
                    : <BsPersonFill size={24}/>
                  } itemList={dropdownList}/>

                </>
            }

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
