import styles from '../../../styles/components/home/Hero.module.css';

export default function Hero(){

  return (
    <div className={styles["hero-container"]}>
      {/* <div className={styles.background}></div> */}
      <div className={styles.content}>
        <h2 className={styles.heading1}> Welcome to Charicha Institute!</h2>
        <h4 className={styles.heading4}> Esteemed institute for Academic Tuitions & Advance Computer Courses.</h4>
        <button className={styles.button}> Enroll Now </button>
        <div className={styles["feature-container"]}>
          <small className={styles.tag}>
            Practical Focused Training
          </small>
          <small className={styles.tag}>
            Excellent Learning Environment
          </small>
          <small className={styles.tag}>
            Excellent Services
          </small>
        </div>
      </div>
    </div>
  );

} 
