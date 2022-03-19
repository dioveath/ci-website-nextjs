import Head from 'next/head';
import Navbar from '../../components/Navbar.js';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import styles from '../../styles/services/Services.module.css';
import ServiceCard from '../../components/services/ServiceCard.js';

export default function Services(){

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <div className={styles.main}>
        <h2> Our Services </h2>
        <p className={styles.bodyText}> Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna, molestie at elementum eu, facilisis sed odio morbi quis commodo. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus? </p>
        <BsFillArrowDownCircleFill size={24}/>

        <div style={{ height: "10px" }}></div>

        <div className={styles["service-container"]}>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>

          <ServiceCard title="Branding">
            Orci eu lobortis elementum, nibh tellus molestie nunc, non? Nunc scelerisque viverra mauris, in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque massa placerat duis ultricies.
          </ServiceCard>                  

        </div>

      </div>

    </div>
  );
  
}
