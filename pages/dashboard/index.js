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
    </main>

    {/* <aside> Extra </aside> */}
  </div>
)};
