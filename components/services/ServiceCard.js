import Image from 'next/image';
import styles from '../../styles/components/service/ServiceCard.module.css';

export default function ServiceCard(props){

  return(
    <div className={styles["service-card"]}>
      {/* <Image src={ props.srcImg !== undefined ? props.srcImg : "image.png"}/> */}
      <div className={styles.title}>
        { props.title }
      </div>
      <div className={styles.content}>
        { props.children }
      </div>
    </div>
  );
}
