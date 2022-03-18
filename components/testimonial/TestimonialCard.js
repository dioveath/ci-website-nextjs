import styles from '../../styles/components/testimonial/TestimonialCard.module.css';
import Image from 'next/image';

export default function TestimonialCard(props){
  return (
    <div className={styles.container}>
      <p className={styles.review}>
        { props.content }
      </p>
      <div className={styles.profile}>
        <Image src="/profile.png" width={100} height={100}/>
      </div>
    </div>
  );
}
