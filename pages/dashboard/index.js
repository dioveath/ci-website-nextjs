import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import PuffLoader from "react-spinners/PuffLoader";
import styles from "../../styles/dashboard/index.module.css";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/footer/Footer.js";
import Tabbar from '../../components/tabbar/Tabbar.js';

import useAuth from "../../lib/hooks/Auth.js";

export default function Dashboard() {
  const { user, userData, loading, error } = useAuth();

  console.log(loading, userData);

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {loading && (
        <div className="loading-container">
          <PuffLoader color="#0EE8E1" />
        </div>
      )}

      {!loading && userData &&  <PageContent userData={userData}/>}

      <Footer />
    </div>
  );
}




const PageContent = ({userData}) => {
  const tabs = [
    {
      id: "Night",
      header: "Good",
      content: <p> Welcome to the good night </p>
    },
    {
      id: "Shit",
      header: "What",
      content: <p> What is this? </p>
    }    
  ];

  return (<div className={styles.main}>
    {/* <nav className={styles.sidebar}> */}
    {/*   <h2> Charicha Institute </h2> */}
    {/*   <div> */}
    {/*     <img alt="" src="" /> */}
    {/*     <div> */}
    {/*       <p> </p> */}
    {/*     </div> */}
    {/*   </div> */}
    {/*   <ul> */}
    {/*     {/\* <li></li> *\/} */}
    {/*   </ul> */}
    {/* </nav> */}

    <main className={styles.mainContent}>
      <div className={styles.myCourses}>
	<p className={styles.headingOne}> My Classes </p>
      </div>
      <div className={styles.profilePhoto}>
        <Image src={userData.photoURL} width="80" height="80" objectFit="fill" objectPosition={"center"}/>
      </div>
      <p className={styles.headingThree}>
        Welcome back { userData.firstName }, ready for your next lesson? 
      </p>

      <Tabbar tabs={tabs}/>

      <div className={styles.card}>
	<div className={styles.cardImage}>
          <Image src={userData.photoURL} alt={`{userData.firstName} Profile Photo`} width="100" height="100" objectFit="cover"/>
	  <div className={styles.progressContainer}></div>          
	  <div className={styles.progress}></div>
        </div>
	<div className={styles.cardBody}>
	  <div className={styles.cardTitle}> Illustration </div>
	  <div className={styles.cardContent}> Illustration in UI Designs </div>
        </div>
      </div>

      <div className={styles.table}>
      <div className={styles.header}>
	<p className={styles.month}> July </p>
	<p className={styles.day}> M </p>
	<p className={styles.day}> T </p>
	<p className={styles.day}> W </p>
	<p className={styles.day}> Th </p>
	<p className={styles.day}> Fr </p>
	<p className={styles.day}> S </p>
      </div>

      <div className={styles.row}>
	<p className={styles.data}> 8:00 </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>
	<p className={styles.data}>  </p>                
      </div>
      </div>

    </main>

    {/* <aside> Extra </aside> */}
  </div>
)};
