import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import styles from '../../styles/contact/Contact.module.css';
import { AiFillPhone } from 'react-icons/ai';
import { ImLocation } from 'react-icons/im';

import Footer from '../../components/footer/Footer.js';
import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

export default function Contact(){
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>
        <Marginer vertical="10px"/>
        <h2> Contact Us </h2>
        <Marginer vertical="10px"/>        
        <p className={styles.bodyText}> Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna, molestie at elementum eu, facilisis sed odio morbi quis commodo. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus? </p>

        <Marginer vertical="40px"/>
        {/* <div style={{ height: "10px"}}> </div> */}

        <div className={styles["main-section"]}>
          <form className={styles["form-container"]}>
            <input name="" type="text" className={styles["form-input"]} placeholder="First Name"/>
            <input name="" type="text"  className={styles["form-input"]} placeholder="Last Name"/>
            <input name="" type="email" className={styles["form-input"]} placeholder="Email"/>
            <input name="" type="number"  className={styles["form-input"]} placeholder="Phone Number"/>

            <textarea cols="30" id="" name="" rows="10" className={styles["text-area"]} placeholder="Your message here..."> </textarea>
            {/* <input name="" type="button" value="Submit" className={styles["primary-button"]}/> */}
            <PrimaryButton text="Submit" onClick={()=> {
              console.log("something");
            }}/>
          </form>
          <div className={styles["info-section"]}>
            <h2> Charicha Institute </h2>
            <Marginer vertical="20px"/>

            <p className={styles.bodyText}> Sed enim ut sem viverra aliquet eget sit. Ultrices eros, in cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed euismod nisi. </p>
            <Marginer vertical="20px"/>            
            <p className={styles.bodyText}>
              <AiFillPhone color="blue"/> <Marginer/> +977 9817-388966 </p>
            <Marginer vertical="20px"/>            
            <p className={styles.bodyText}> <ImLocation color="red"/> <Marginer/> Belbari - 11, Laxmimarga </p>            
          </div>
        </div>


      </main>

      <Footer/>

    </div>

  );

}
