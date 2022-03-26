import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/components/Navbar.module.css';

export default function Navbar(){

  return (
    <nav className={styles.nav}>
      <div>
        <Image src="/ci_logo_light_blue.png" alt="Charicha Institute Logo" width={105} height={36} />        
      </div>
      <ul className={styles.navlist}>
        {/* <li className={styles.navitem}> Home </li> */}
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

      </ul>

    </nav>
  );

}
