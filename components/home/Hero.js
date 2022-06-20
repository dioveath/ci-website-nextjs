import Image from "next/image";
import styles from "../../styles/components/home/Hero.module.css";
import Marginer from "../utils/Marginer.js";

import { VscDebugBreakpointLog } from "react-icons/vsc";

export default function Hero() {
  return (
    <div className={styles["hero-container"]}>
      <div className={styles.background}>
        <Image
          alt=""
          src="/landing_image.png"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className={styles.content}>
        <Marginer vertical="40px" />
        <h2 className={styles.heading1}> Welcome to Charicha Institute!</h2>
        <Marginer vertical="10px" />
        <h4 className={styles.heading4}>
          Esteemed institute for Academic Tuitions & Advance Computer Courses.
        </h4>
        <Marginer vertical="20px" />
        <button className={styles.button}> Enroll Now </button>
        <div className={styles["feature-container"]}>
          <small className={styles.tag}>
            <VscDebugBreakpointLog />
            <Marginer horizontal="10px" />
            Practical Focused Training
          </small>
          <small className={styles.tag}>
            <VscDebugBreakpointLog />
            <Marginer horizontal="10px" />
            Excellent Learning Environment
          </small>
          <small className={styles.tag}>
            <VscDebugBreakpointLog />
            <Marginer horizontal="10px" />
            Excellent Services
          </small>
        </div>
      </div>
    </div>
  );
}
