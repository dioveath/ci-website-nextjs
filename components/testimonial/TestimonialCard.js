import styles from '../../styles/components/testimonial/TestimonialCard.module.css';
import Image from 'next/image';

export default function TestimonialCard(props){
  return (
    <div className={styles.container}>
      <div className={styles["review-container"]}>
        <p className={styles.review}>
          { '\"' + props.content + '\"' }
        </p>
        <p className={styles.reviewer}>
          { "- " + props.reviewer }
        </p>        
      </div>
      <div className={styles.profile}>
        <Image src="/profile.jpg" width={300} height={300} className={styles["profile-image"]}/>
      </div>
    </div>
  );
}
