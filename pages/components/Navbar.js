import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/components/Navbar.module.css';

export default function Navbar(){

  return (
    <nav className={styles.nav}>
      <div>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />        
      </div>
      <ul className={styles.navlist}>
        <li className={styles.navitem}> Home </li>
        <li className={styles.navitem}> Courses </li>
        <li className={styles.navitem}> Services </li>
        <li className={styles.navitem}> Blog </li>
        <li className={styles.navitem}> Contact </li>
      </ul>
    </nav>
  );

}
