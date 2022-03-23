import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/components/Navbar.module.css';

import { useUser } from '@auth0/nextjs-auth0';

export default function Navbar(){

  const { user, error, isLoading } = useUser();

  return (
    <nav className={styles.nav}>
      <div>
        <Image src="/ci_logo_light_blue.png" alt="Charicha Institute Logo" width={105} height={36} />        
      </div>
      <ul className={styles.navlist}>
        {/* <li className={styles.navitem}> Home </li> */}
        <Link className={styles.navitem} href="/">
          <a> Home </a>
        </Link>
        <Link className={styles.navitem} href="/courses">
          <a> Courses </a>
        </Link>
        <Link className={styles.navitem} href="/services">
          <a> Services </a>
        </Link>
        <Link className={styles.navitem} href="/blog">
          <a> Blog </a>
        </Link>
        <Link className={styles.navitem} href="/contact">
          <a> Contact </a>
        </Link>

        {
          user !== undefined ?
            <p>
              Welcome { user.name } <a href="/api/auth/logout"> Logout </a>
          </p>
          : <p>
              <a href="/api/auth/login"> Login </a>
            </p>
        }
      </ul>

    </nav>
  );

}
