import Image from 'next/image';
import styles from '../../styles/components/service/ServiceCard.module.css';
import Marginer from '../utils/Marginer.js';

export default function ServiceCard(props){

  return(
    <div className={styles["service-card"]}>
      {/* <Image src={ props.srcImg !== undefined ? props.srcImg : "image.png"}/> */}
      <div className={styles.title}>
        { props.title }
      </div>
      <Marginer vertical="12px"/>
      <div className={styles.content}>
        { props.children }
      </div>
    </div>
  );
}
