import Image from 'next/image';
import styles from './blogcard.module.css';

import { BsFillCircleFill } from 'react-icons/bs';

export default function BlogCard(){

  return(
    <div className={styles["blog-container"]}>
      <div className={styles["image-container"]}>
        <Image src="/travel-world.jpg" width={"900"} height={"500"} className={styles["blog-image"]}/>
      </div>

      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"]}> Travels </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>          
          <p className={styles["small-publish-date"]}> March 21 2022 </p>  
        </div>

        <div className={styles["blog-title"]}> Odio euismod lacinia at quis risus sed vulputate odio ut</div>
        <div className={styles["blog-summary"]}> Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet, consectetur adipiscing elit duis tristique sollicitudin nibh sit. Dictum varius duis at consectetur lorem donec massa sapien, faucibus et molestie? </div>
        {/* <div className={styles["blog-author-container"]}> */}
        {/*   <Image src="/profile.jpg" width={64} height={64} objectFit="contain" className={styles["author-profile"]}/> */}
        {/*   <div className={styles["blog-author-info-container"]}> */}
        {/*     <p className={styles["blog-author-name"]}> Ajaya Rajbhandari </p>         */}
        {/*     <p className={styles["blog-author-post"]}> Chief Executive Officer </p>           */}
        {/*   </div> */}
        {/* </div> */}
      </div>      
    </div>
  );

}
