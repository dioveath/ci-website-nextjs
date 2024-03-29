import styles from '../../styles/components/blog/topblog.module.css';
import Image from 'next/image';
import Marginer from '../../components/utils/Marginer.js';

import { BsFillCircleFill } from 'react-icons/bs';

export default function TopBlog(){

  return(
    <div className={styles["top-blog-container"]}>
      <Image alt='top blog image' src="/travel-world.jpg" width={700} height={400} objectFit="fill" />

      <div style={{ width: "30px"}}></div>                
      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"]}> Travels </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>          
          <p className={styles["small-publish-date"]}> March 21 2022 </p>  
        </div>
        <Marginer vertical="10px"/>
        <div className={styles["blog-title"]}> Odio euismod lacinia at quis risus sed vulputate odio ut</div>
        <Marginer vertical="10px"/>        
        <div className={styles["blog-summary"]}> Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet, consectetur adipiscing elit duis tristique sollicitudin nibh sit. Dictum varius duis at consectetur lorem donec massa sapien, faucibus et molestie? </div>
        <Marginer vertical="20px"/>                
        <div className={styles["blog-author-container"]}>
          <Image alt='tob blog author' src="/profile.jpg" width={64} height={64} objectFit="cover" className={styles["author-profile"]}/>
          <Marginer horizontal="14px"/>                          
          <div className={styles["blog-author-info-container"]}>
            <p className={styles["blog-author-name"]}> Ajaya Rajbhandari </p>
            <Marginer vertical="5px"/>                                      
            <p className={styles["blog-author-post"]}> Chief Executive Officer </p>          
          </div>
        </div>
      </div>

    </div>
  );

}
