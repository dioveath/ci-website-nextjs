// import Image from 'next/image';
import styles from './footer.module.css';
import Marginer from '../../components/utils/Marginer.js';

import { BsPhoneFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

export default function Footer (){
  return (<div>
            <div style={{"height": "20px"}}></div>            
            <footer className={styles.footer}>
              <div className={styles.footerContents}>
                <div className={styles.primaryFooterContents}>
                  <div className={styles.logoImg}>
                    <img src="/ci_logo_light_blue.png" alt="Charicha Institute Logo"/>
                  </div>
                  <Marginer vertical="20px"/>

                  <p className={styles.infoText}>Charicha Institute helps interested students to learn and use their computer skills from basic
                    courses to advanced courses like programming in real world. Come join us and
                    grow.
                  </p>
                </div>
                <div className={styles.secondaryFooterContents}>
                  <h3>Charicha Institute</h3>
                  <Marginer vertical="10px"/>
                  <ul className={styles.navLinks}>
                    <li><a href="">Home</a></li>
                    <li><a href="">Courses</a></li>
                    <li><a href="">Services</a></li>
                    <li><a href="">Blog</a></li>
                    <li><a href="">Contact Us</a></li>
                  </ul>
                </div>
                <div className={styles.thirdFooterContents}>
                  <h3>Other Links</h3>
                  <Marginer vertical="10px"/>                  
                  <ul className={styles.navLinks}>
                    <li><a href="">Charicha Productions</a></li>
                    <li><a href="">Charicha Gaming</a></li>
                    <li><a href="">Charicha Education Consultancy</a></li>
                  </ul>
                </div>
                <div className={styles.fourthFooterContents}>
                  <h3> Contact Us </h3>
                  <Marginer vertical="10px"/>
                  <div className={styles.iconInfo}>
                    <BsPhoneFill color="greenyellow"/>
                    <Marginer/>
                    +977 981-7388966
                  </div>
                  <Marginer/>                  
                  <div className={styles.iconInfo}>
                    <MdEmail color="#39A1FF"/>
                    <Marginer/>                    
                    charichainstitute@gmail.com
                  </div>
                  <Marginer/>                  
                  <div className={styles.iconInfo}>
                    <MdLocationOn color="red"/>
                    <Marginer/>                    
                    Belbari - 11
                  </div>
                </div>
              </div>

            </footer>
            <div className={styles.copyright}>
              <p>Charicha Institute &copy; All Rights Reserved</p>
            </div>            
          </div>          
         );
}
