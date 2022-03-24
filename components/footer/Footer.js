// import Image from 'next/image';
import styles from './footer.module.css';

export default function Footer (){
  return (<div>
            <div style={{"height": "20px"}}></div>            
            <hr/>
            <footer className={styles.footer}>
              <div className={styles.footerContents}>
                <div className={styles.primaryFooterContents}>
                  <div className={styles.logoImg}>
                    <img src="/ci_logo_light_blue.png" alt="Charicha Institute Logo"/>
                  </div>
                  <div className={styles.logoBorder1}></div>
                  <p>Charicha Institute helps interested students to learn and use their computer skills from basic
                    courses to advanced courses like programming in real world. Come join us and
                    grow.
                  </p>
                </div>
                <div className={styles.secondaryFooterContents}>
                  <h3>Charicha Institute</h3>
                  <div className={styles.logoBorder2}></div>
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
                  <div className={styles.logoBorder2}></div>
                  <ul className={styles.navLinks}>
                    <li><a href="">Charicha Productions</a></li>
                    <li><a href="">Charicha Gaming</a></li>
                    <li><a href="">Charicha Education Consultancy</a></li>
                  </ul>
                </div>
              </div>
              <div className={styles.copyright}>
                <p>Charicha Institute (c) All Rights Reserved</p>
              </div>
            </footer>
          </div>          
         );
}
